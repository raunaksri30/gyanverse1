import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface QuizViewProps {
  quiz: QuizQuestion[];
  onRetake: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onRetake }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (showResults) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const score = selectedAnswers.reduce((total, answer, index) => {
    return answer === quiz[index].correctAnswer ? total + 1 : total;
  }, 0);

  if (showResults) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-2xl animate-fade-in text-slate-800">
        <h2 className="text-3xl font-bold text-center text-blue-600">Quiz Results</h2>
        <p className="text-center text-xl my-6">
          You scored <span className="font-bold text-2xl text-slate-900">{score}</span> out of <span className="font-bold text-2xl text-slate-900">{quiz.length}</span>
        </p>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {quiz.map((q, index) => (
                <div key={index} className="bg-slate-100 p-4 rounded-lg">
                    <p className="font-semibold">{index + 1}. {q.question}</p>
                    <p className={`mt-2 ${selectedAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                        Your answer: {selectedAnswers[index] || 'Not answered'}
                    </p>
                    {selectedAnswers[index] !== q.correctAnswer && <p className="text-blue-500">Correct answer: {q.correctAnswer}</p>}
                </div>
            ))}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105">
            Try Again
          </button>
          <button onClick={onRetake} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105">
            Generate New Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-end items-center mb-4">
        <p className="text-slate-500 font-mono">
          {currentQuestionIndex + 1} / {quiz.length}
        </p>
      </div>
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-md mb-6">
        <p className="text-xl font-semibold leading-relaxed text-slate-800">
          {currentQuestion.question}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`p-4 rounded-lg text-left transition-all duration-200 border-2 text-slate-700 ${
              selectedAnswers[currentQuestionIndex] === option
                ? 'bg-blue-600 border-blue-500 scale-105 shadow-lg text-white'
                : 'bg-slate-100 border-transparent hover:bg-slate-200 hover:border-blue-300'
            }`}
          >
            <span className="font-mono text-blue-500 mr-3">{String.fromCharCode(65 + index)}.</span>
            {option}
          </button>
        ))}
      </div>
      <div className="mt-8 text-right">
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-transform hover:scale-105"
        >
          {currentQuestionIndex < quiz.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;