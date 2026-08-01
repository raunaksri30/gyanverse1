import React from 'react';
// Fix: 'AppView' was imported as a type-only import but used as a value.
// It is now imported as a value, while other types remain type-only imports.
import { AppView } from '../types';
import type { DashboardData, FocusArea, RecentActivity } from '../types';
import { StreakIcon, XPIcon, TopicsIcon, TimeIcon, RecommendationIcon, ActivityIcon, RightArrowIcon, HomeIcon, CalendarIcon } from './icons';

interface DashboardViewProps {
  setView: (view: AppView) => void;
  data: DashboardData;
}

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const FocusAreaItem: React.FC<{ area: FocusArea, color: string }> = ({ area, color }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <p className="font-medium text-slate-700">{area.topic}</p>
            <p className={`font-semibold text-sm ${color.replace('bg', 'text').replace('-200', '-700')}`}>{area.mastery}%</p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${area.mastery}%` }}></div>
        </div>
    </div>
);

const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0">
        <div>
            <p className="font-semibold text-slate-800">{activity.title}</p>
            <p className="text-sm text-slate-500">{activity.details}</p>
        </div>
        <div className="text-right">
             <p className={`text-sm font-bold ${activity.type === 'Quiz' && parseInt(activity.details) > 80 ? 'text-green-600' : 'text-slate-600'}`}>{activity.type === 'Quiz' ? `${activity.details}` : ""}</p>
            <p className="text-xs text-slate-400">{activity.timestamp}</p>
        </div>
    </div>
)

const DashboardView: React.FC<DashboardViewProps> = ({ setView, data }) => {
  return (
    <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Performance Dashboard</h1>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setView(AppView.LANDING)}
                        className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                        <HomeIcon /> Home
                    </button>
                    <button 
                        onClick={() => setView(AppView.SCHEDULE)}
                        className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                        <CalendarIcon /> Schedule
                    </button>
                    <button 
                        onClick={() => setView(AppView.STUDY)}
                        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        Start Studying <RightArrowIcon />
                    </button>
                </div>
            </div>
        </header>

        <main className="container mx-auto p-6">
            <p className="text-slate-600 mb-6">Track your progress and identify areas for improvement.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<StreakIcon />} label="Study Streak" value={`${data.studyStreak} days`} color="bg-orange-100 text-orange-600" />
                <StatCard icon={<XPIcon />} label="Total XP" value={data.totalXP.toLocaleString()} color="bg-yellow-100 text-yellow-600" />
                <StatCard icon={<TopicsIcon />} label="Topics Mastered" value={`${data.topicsMastered}/${data.totalTopics}`} color="bg-green-100 text-green-600" />
                <StatCard icon={<TimeIcon />} label="Study Time" value={data.studyTime} color="bg-blue-100 text-blue-600" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Focus Areas */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><ActivityIcon />Focus Areas</h2>
                    <div className="space-y-6">
                        <FocusAreaItem area={data.focusAreas[0]} color="bg-red-200" />
                        <FocusAreaItem area={data.focusAreas[1]} color="bg-purple-200" />
                        <FocusAreaItem area={data.focusAreas[2]} color="bg-blue-200" />
                    </div>
                    <div className="mt-6 bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-start gap-3">
                        <RecommendationIcon />
                        <div>
                            <h3 className="font-semibold text-slate-700">Recommendation</h3>
                            <p className="text-sm text-slate-600">Focus on Integration this week. Spend 30 mins daily on practice problems.</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
                    <div className="space-y-2">
                        {data.recentActivity.map((activity, index) => (
                            <ActivityItem key={index} activity={activity} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default DashboardView;