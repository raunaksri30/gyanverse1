import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { GoogleGenAI, Type } from '@google/genai';

// Load standard .env and also .env.local (created by the frontend setup)
dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Missing Gemini API key. Set VITE_GEMINI_API_KEY or GEMINI_API_KEY in env.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const model = 'gemini-2.5-flash';

async function callGemini(parts, config) {
  const response = await ai.models.generateContent({ model, contents: { parts }, config });
  return response.text;
}

app.post('/api/answer', async (req, res) => {
  try {
    const { base64Data, mimeType, question } = req.body;
    const filePart = { inlineData: { data: base64Data, mimeType } };
    const textPart = { text: `Based on the provided document, answer the following question: "${question}". Provide a concise and helpful answer.` };
    const result = await callGemini([filePart, textPart]);
    res.json({ result });
  } catch (err) {
    console.error('Error /api/answer', err);
    res.status(500).json({ error: 'Failed to get answer from AI' });
  }
});

app.post('/api/summary', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    const filePart = { inlineData: { data: base64Data, mimeType } };
    const textPart = { text: 'Analyze the provided document and create a concise, easy-to-read summary. Use markdown bullet points for key takeaways.' };
    const result = await callGemini([filePart, textPart]);
    res.json({ result });
  } catch (err) {
    console.error('Error /api/summary', err);
    res.status(500).json({ error: 'Failed to get summary from AI' });
  }
});

app.post('/api/concepts', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    const filePart = { inlineData: { data: base64Data, mimeType } };
    const textPart = { text: 'Read through the provided document and extract the most important key concepts, format as markdown list with bold terms.' };
    const result = await callGemini([filePart, textPart]);
    res.json({ result });
  } catch (err) {
    console.error('Error /api/concepts', err);
    res.status(500).json({ error: 'Failed to extract concepts from AI' });
  }
});

app.post('/api/quiz', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    const filePart = { inlineData: { data: base64Data, mimeType } };
    const textPart = { text: 'Analyze the provided document and generate a 5-question multiple-choice quiz with 4 options each. Return JSON array.' };

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [filePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswer']
          }
        }
      }
    });

    const jsonText = response.text;
    let quizData;
    try {
      quizData = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse quiz JSON', e, jsonText);
      return res.status(500).json({ error: 'Invalid quiz format from AI' });
    }

    res.json({ result: quizData });
  } catch (err) {
    console.error('Error /api/quiz', err);
    res.status(500).json({ error: 'Failed to generate quiz from AI' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend server listening on http://localhost:${port}`));
