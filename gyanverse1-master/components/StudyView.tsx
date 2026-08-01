import React, { useState, useRef, useEffect } from 'react';
import type { Message, QuizQuestion } from '../types';
import { AppView } from '../types';
import FileUpload from './FileUpload';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuizView from './QuizView';
import { BrainIcon, MessagesIcon, SparklesIcon, SummaryIcon, KeyIcon, Eli5Icon, DashboardIcon, HomeIcon, BackArrowIcon, CalendarIcon } from './icons';
import { generateAnswerFromDoc, generateSummaryFromDoc, extractKeyConceptsFromDoc, generateQuizFromDoc } from './services/geminiService';

interface StudyViewProps {
  setView: (view: AppView) => void;
}

const StudyView: React.FC<StudyViewProps> = ({ setView }) => {
  const [internalView, setInternalView] = useState<AppView>(AppView.CHAT);
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: "Hello! I'm GyanVerse. Upload a PDF to get started.",
    },
  ]);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoReadAloud, setAutoReadAloud] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (message: Message) => {
    if (speechSynthesis.speaking && speakingMessageId === message.id) {
      speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(message.text.replace(/\*\*/g, ''));
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis Error", e);
      setSpeakingMessageId(null);
    };
    setSpeakingMessageId(message.id);
    speechSynthesis.speak(utterance);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // fileToBase64 helper is defined above

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setMessages([
      {
        id: '1',
        role: 'ai',
        text: `Successfully uploaded **${uploadedFile.name}**. You can now ask me questions about it or generate a quiz.`,
      },
    ]);
    setQuiz(null);
    setInternalView(AppView.CHAT);
  };

  const handleSendMessage = async (text: string) => {
    if (!file) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'ai', text: 'Please upload a file first.' },
      ]);
      return;
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const base64Data = await fileToBase64(file);
      const answer = await generateAnswerFromDoc(base64Data, file.type, text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: answer,
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (autoReadAloud) {
        speak(aiMessage);
      }
    } catch (error: any) {
      console.error(error);
      const errorText = error?.message?.includes('rate limit')
        ? 'Rate limit exceeded. Please wait about a minute and try again.'
        : `Sorry, something went wrong: ${error?.message || 'Unknown error'}. Please try again.`;
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: errorText,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!file) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'ai', text: 'Please upload a file to generate a quiz.' },
      ]);
      return;
    }

    setIsLoading(true);
    const quizRequestMessage: Message = {
      id: Date.now().toString(),
      role: 'ai',
      text: 'Generating a quiz from your document... This might take a moment.',
    };
    setMessages((prev) => [...prev, quizRequestMessage]);
    setInternalView(AppView.CHAT);

    try {
      const base64Data = await fileToBase64(file);
      const generatedQuiz = await generateQuizFromDoc(base64Data, file.type);
      setQuiz(generatedQuiz);
      setInternalView(AppView.QUIZ);
    } catch (error: any) {
      console.error(error);
      const errorText = error?.message?.includes('rate limit')
        ? 'Rate limit exceeded. Please wait about a minute and try again.'
        : `Sorry, I had trouble creating the quiz: ${error?.message || 'Unknown error'}`;
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: errorText,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmartAction = async (action: 'summary' | 'concepts' | 'eli5') => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setInternalView(AppView.CHAT);
    setIsLoading(true);

    let userPrompt = '';
    let promise: Promise<string>;
    const base64Data = await fileToBase64(file);

    switch (action) {
      case 'summary':
        userPrompt = 'Summarize this document for me.';
        promise = generateSummaryFromDoc(base64Data, file.type);
        break;
      case 'concepts':
        userPrompt = 'Extract the key concepts from this document.';
        promise = extractKeyConceptsFromDoc(base64Data, file.type);
        break;
      case 'eli5':
        const topic = window.prompt("What topic do you want explained simply?");
        if (!topic) {
          setIsLoading(false);
          return;
        }
        userPrompt = `Explain "${topic}" like I'm 5.`;
        promise = generateAnswerFromDoc(base64Data, file.type, `From the document, explain the topic "${topic}" in very simple terms, as if you were explaining it to a 5-year-old child.`);
        break;
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: userPrompt };
    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await promise;
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: result };
      setMessages(prev => [...prev, aiMessage]);
      if (autoReadAloud) {
        speak(aiMessage);
      }
    } catch (error) {
      console.error(`Error with smart action ${action}:`, error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `Sorry, I had trouble with that action. Please try again.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex h-screen font-sans bg-white text-slate-900">
      <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 mb-8 text-slate-800">
            <SparklesIcon />
            GyanVerse
          </h1>
          <FileUpload onFileUpload={handleFileUpload} disabled={isLoading} />

          <nav className="mt-8">
            <ul className='space-y-2'>
              <li>
                <button
                  onClick={() => setView(AppView.LANDING)}
                  className="w-full text-slate-600 font-medium flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100"
                >
                  <HomeIcon />
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setInternalView(AppView.CHAT)}
                  disabled={isLoading}
                  className={`w-full text-slate-600 font-medium flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${internalView === AppView.CHAT ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'
                    }`}
                >
                  <MessagesIcon />
                  Chat
                </button>
              </li>
              <li>
                <button
                  onClick={quiz ? () => setInternalView(AppView.QUIZ) : handleGenerateQuiz}
                  disabled={isLoading || !file}
                  className="w-full text-slate-600 font-medium flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BrainIcon />
                  {quiz ? 'Show Quiz' : 'Generate Quiz'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView(AppView.DASHBOARD)}
                  className="w-full text-slate-600 font-medium flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100"
                >
                  <DashboardIcon className='w-5 h-5' />
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView(AppView.SCHEDULE)}
                  className="w-full text-slate-600 font-medium flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100"
                >
                  <CalendarIcon />
                  Schedule
                </button>
              </li>
            </ul>
          </nav>

          <div className="mt-8 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Smart Actions</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleSmartAction('summary')} disabled={isLoading || !file} className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 rounded-lg transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SummaryIcon />
                  Summarize Doc
                </button>
              </li>
              <li>
                <button onClick={() => handleSmartAction('concepts')} disabled={isLoading || !file} className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 rounded-lg transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <KeyIcon />
                  Key Concepts
                </button>
              </li>
              <li>
                <button onClick={() => handleSmartAction('eli5')} disabled={isLoading || !file} className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 rounded-lg transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Eli5Icon />
                  Explain for Me
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-auto">
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Settings</h3>
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-100">
              <span className="text-slate-600">Auto-Read Responses</span>
              <div className="relative">
                <input type="checkbox" checked={autoReadAloud} onChange={() => setAutoReadAloud(p => !p)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {internalView === AppView.QUIZ && (
              <button
                onClick={() => setInternalView(AppView.CHAT)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
                aria-label="Back to chat"
              >
                <BackArrowIcon />
              </button>
            )}
            <h2 className="text-xl font-bold text-slate-800">
              {internalView === AppView.CHAT ? 'Chat' : 'Quiz'}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-slate-900">
          <div className="max-w-4xl mx-auto">
            {internalView === AppView.CHAT ? (
              <>
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    speak={speak}
                    isSpeaking={speakingMessageId === msg.id}
                  />
                ))}
                {isLoading && (
                  <ChatMessage
                    message={{ id: 'loading', role: 'ai', text: 'Thinking...' }}
                    isLoading={true}
                  />
                )}
                <div ref={chatEndRef} />
              </>
            ) : (
              quiz && <QuizView quiz={quiz} onRetake={handleGenerateQuiz} />
            )}
          </div>
        </div>

        {internalView === AppView.CHAT && (
          <div className="p-6 bg-white border-t border-slate-200">
            <div className="max-w-4xl mx-auto">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyView;