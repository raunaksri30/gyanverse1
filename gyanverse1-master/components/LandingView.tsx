import React from 'react';
import { AppView } from '../types';
import { AnalyticsIcon, GamifiedIcon, OrganizationIcon, ChatIcon, AdaptiveIcon, BrainIcon, RightArrowIcon, CalendarIcon } from './icons';

interface LandingViewProps {
  setView: (view: AppView) => void;
}

const features = [
    { icon: <BrainIcon />, title: "AI-Powered Learning", description: "Get instant answers from your study materials using advanced RAG technology." },
    { icon: <OrganizationIcon />, title: "Smart Organization", description: "Upload notes, PDFs, and documents - automatically categorized by topic." },
    { icon: <ChatIcon />, title: "Interactive Chat", description: "Ask questions in natural language, get precise answers from your content." },
    { icon: <CalendarIcon />, title: "Schedule Manager", description: "Auto-reminders, deadlines, priority tagging, and calendar views for assignments." },
    { icon: <GamifiedIcon />, title: "Gamified Progress", description: "Earn XP, maintain streaks, and unlock achievements as you learn." },
    { icon: <AnalyticsIcon />, title: "Performance Analytics", description: "ML-powered insights identify weak topics and create revision plans." },
];

const LandingView: React.FC<LandingViewProps> = ({ setView }) => {
  return (
    <div className="w-full bg-white text-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">GyanVerse</h1>
          <button 
            onClick={() => setView(AppView.STUDY)}
            className="bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Launch App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 to-blue-100">
        <div className="container mx-auto px-6 text-center">
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">Powered by Advanced AI & ML</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-4">
                Your AI Study Assistant
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Transform scattered notes into organized knowledge. Get instant answers, personalized revision plans, and gamified progress tracking.
            </p>
            <div className="flex justify-center items-center gap-4">
                <button 
                    onClick={() => setView(AppView.STUDY)}
                    className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105"
                >
                    Start Learning
                </button>
                <button 
                    onClick={() => setView(AppView.DASHBOARD)}
                    className="bg-white text-slate-700 font-semibold px-8 py-3 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                    View Dashboard
                </button>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900">Everything You Need to Excel</h2>
                <p className="text-slate-500 mt-2">One platform, infinite possibilities.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 p-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
                        <div className="text-blue-600 mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800">{feature.title}</h3>
                        <p className="text-slate-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Metrics Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <p className="text-5xl font-bold text-blue-600">98%</p>
                    <p className="text-slate-500 mt-1">Accuracy Rate</p>
                </div>
                <div>
                    <p className="text-5xl font-bold text-blue-600">10x</p>
                    <p className="text-slate-500 mt-1">Faster Revision</p>
                </div>
                <div>
                    <p className="text-5xl font-bold text-blue-600">24/7</p>
                    <p className="text-slate-500 mt-1">AI Availability</p>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-blue-200 max-w-2xl mx-auto mb-8">Join thousands of students already studying smarter, not harder.</p>
            <button 
                onClick={() => setView(AppView.STUDY)}
                className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-slate-100 transition-transform hover:scale-105"
            >
                Get Started Free
            </button>
        </div>
      </section>
    </div>
  );
};

export default LandingView;