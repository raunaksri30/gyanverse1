import type { QuizQuestion } from '../../types';

// Load API key from environment variable - supports both Groq and Gemini
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!groqApiKey && !geminiApiKey) {
  console.error("No API key found. Please set VITE_GROQ_API_KEY or VITE_GEMINI_API_KEY in your .env file.");
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

async function callAI(systemPrompt: string, userContent: string, maxRetries = 3): Promise<string> {
  if (groqApiKey) {
    return callGroq(systemPrompt, userContent, maxRetries);
  } else if (geminiApiKey) {
    return callGemini(systemPrompt, userContent, maxRetries);
  }
  throw new Error("No API key configured. Please set VITE_GROQ_API_KEY or VITE_GEMINI_API_KEY in your .env file.");
}

async function callGroq(systemPrompt: string, userContent: string, maxRetries = 3): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          temperature: 0.7,
          max_tokens: 4096,
          top_p: 0.95,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || `HTTP ${response.status}`;

        if (response.status === 429 && attempt < maxRetries) {
          const waitTime = attempt * 10;
          console.log(`Groq rate limited. Waiting ${waitTime}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          continue;
        }

        throw new Error(errorMsg);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response generated.";
    } catch (error: any) {
      console.error(`Groq API attempt ${attempt}/${maxRetries} failed:`, error?.message);

      if (attempt === maxRetries) {
        if (error?.message?.includes('429')) {
          throw new Error("API rate limit exceeded. Please wait a moment and try again.");
        }
        throw new Error(`AI request failed: ${error?.message || 'Unknown error'}`);
      }
    }
  }
  throw new Error("Max retries exceeded.");
}

async function callGemini(systemPrompt: string, userContent: string, maxRetries = 3): Promise<string> {
  // Dynamic import to avoid loading if not needed
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(geminiApiKey!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userContent}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          topP: 0.95,
        }
      });
      return result.response.text() || "No response generated.";
    } catch (error: any) {
      console.error(`Gemini API attempt ${attempt}/${maxRetries} failed:`, error?.message);

      const isRateLimit = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Resource has been exhausted');
      if (isRateLimit && attempt < maxRetries) {
        const waitTime = attempt * 15;
        console.log(`Rate limited. Waiting ${waitTime}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        continue;
      }

      if (attempt === maxRetries) {
        if (isRateLimit) {
          throw new Error("API rate limit exceeded. Please wait a minute and try again.");
        }
        throw new Error(`AI request failed: ${error?.message || 'Unknown error'}`);
      }
    }
  }
  throw new Error("Max retries exceeded.");
}

// Import PDF.js for proper PDF text extraction
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js - using CDN matching installed version (5.4.530)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs';

// Helper to convert base64 PDF to text using PDF.js
async function extractTextFromBase64(base64Data: string, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    try {
      // Convert base64 to Uint8Array
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      const trimmedText = fullText.trim();
      if (!trimmedText) {
        throw new Error("No readable text found in this PDF. It might be scanned or image-based.");
      }

      // Limit to prevent token overflow
      if (trimmedText.length > 15000) {
        return trimmedText.substring(0, 15000) + '\n\n[Document truncated for length...]';
      }

      return trimmedText;
    } catch (e: any) {
      console.error("Error extracting text from PDF:", e);
      throw new Error(e?.message || "Failed to parse PDF document.");
    }
  }

  // For text files
  try {
    return atob(base64Data);
  } catch {
    return "[Document content]";
  }
}

export async function generateAnswerFromDoc(base64Data: string, mimeType: string, question: string): Promise<string> {
  const docText = await extractTextFromBase64(base64Data, mimeType);

  const systemPrompt = "You are a helpful study assistant. Answer questions about the provided document content. Be concise and accurate. Use markdown formatting when helpful.";
  const userContent = `Document content:\n${docText}\n\nQuestion: ${question}`;

  return callAI(systemPrompt, userContent);
}

export async function generateSummaryFromDoc(base64Data: string, mimeType: string): Promise<string> {
  const docText = await extractTextFromBase64(base64Data, mimeType);

  const systemPrompt = "You are a helpful study assistant. Create clear, concise summaries of documents. Use markdown bullet points for key takeaways and bold text for important terms.";
  const userContent = `Please summarize this document:\n\n${docText}`;

  return callAI(systemPrompt, userContent);
}

export async function extractKeyConceptsFromDoc(base64Data: string, mimeType: string): Promise<string> {
  const docText = await extractTextFromBase64(base64Data, mimeType);

  const systemPrompt = "You are a helpful study assistant. Extract and explain key concepts, terms, and definitions from documents. Format as a markdown list with terms in bold.";
  const userContent = `Extract the key concepts from this document:\n\n${docText}`;

  return callAI(systemPrompt, userContent);
}

export async function generateQuizFromDoc(base64Data: string, mimeType: string): Promise<QuizQuestion[]> {
  const docText = await extractTextFromBase64(base64Data, mimeType);

  const systemPrompt = `You are a quiz generator. Generate exactly 5 multiple-choice questions based on the document content.
  
  IMPORTANT: Respond ONLY with a valid JSON array in this exact format, no other text:
  [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
  
  Each question must have exactly 4 options. The correctAnswer must be one of the options.`;

  const userContent = `Generate a quiz from this document:\n\n${docText}`;

  const response = await callAI(systemPrompt, userContent);

  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const quizData = JSON.parse(jsonMatch[0]);
      if (Array.isArray(quizData)) {
        return quizData as QuizQuestion[];
      }
    }
    throw new Error("No valid JSON array found in response");
  } catch (error) {
    console.error("Failed to parse quiz JSON:", error);
    console.error("Raw response:", response);
    throw new Error("The AI returned an invalid format for the quiz. Please try again.");
  }
}
