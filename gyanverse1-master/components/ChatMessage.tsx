import React from 'react';
import type { Message } from '../types';
import { UserIcon, SparklesIcon, SpeakerOnIcon, SpeakerOffIcon } from './icons';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
  speak?: (message: Message) => void;
  isSpeaking?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false, speak, isSpeaking }) => {
  const isUser = message.role === 'user';
  
  // A simple markdown-like parser for bold text
  const formattedText = message.text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });

  return (
    <div className={`group flex items-start gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${
          isUser ? 'bg-blue-600' : 'bg-slate-700'
        }`}
      >
        {isUser ? <UserIcon /> : <SparklesIcon />}
      </div>
      <div
        className={`relative px-5 py-3 rounded-2xl max-w-2xl text-white ${
          isUser ? 'bg-blue-600 rounded-br-none' : 'bg-slate-800 rounded-bl-none'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{formattedText}</p>
        )}
      </div>
      {!isUser && !isLoading && speak && (
          <button 
            onClick={() => speak(message)} 
            className="self-center p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={isSpeaking ? "Stop reading" : "Read message aloud"}
            >
            {isSpeaking ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
          </button>
      )}
    </div>
  );
};

export default ChatMessage;