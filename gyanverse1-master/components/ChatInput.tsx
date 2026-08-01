// Fix for SpeechRecognition errors: Add type definitions for the Web Speech API.
// These are not included in standard TypeScript DOM library typings.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, MicrophoneIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        onSendMessage(transcript); // Automatically send after successful transcription
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }

    return () => {
        recognitionRef.current?.abort();
    }
  }, [onSendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMicClick = () => {
    if (isLoading || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-grow">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Ask a question about your document..."}
          className="w-full bg-slate-100 border border-slate-300 rounded-lg p-4 pr-16 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow text-slate-800"
          rows={1}
          disabled={isLoading || isListening}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon />
        </button>
      </div>
      {recognitionRef.current && (
        <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading}
            className={`p-3 rounded-full text-white transition-colors disabled:opacity-50 ${
                isListening ? 'bg-red-600 animate-pulse' : 'bg-slate-600 hover:bg-slate-700'
            }`}
        >
            <MicrophoneIcon />
        </button>
      )}
    </form>
  );
};

export default ChatInput;