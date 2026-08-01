import React, { useState } from 'react';
import { AppView } from './types';
import LandingView from './components/LandingView';
import DashboardView from './components/DashboardView';
import StudyView from './components/StudyView';
import ScheduleView from './components/ScheduleView';
import { mockDashboardData, mockScheduleData } from './mockData';

const App: React.FC = () => {
    const [appView, setAppView] = useState<AppView>(AppView.LANDING);

    const renderView = () => {
        switch (appView) {
            case AppView.LANDING:
                return <LandingView setView={setAppView} />;
            case AppView.DASHBOARD:
                return <DashboardView setView={setAppView} data={mockDashboardData} />;
            case AppView.STUDY:
                return <StudyView setView={setAppView} />;
            case AppView.SCHEDULE:
                return <ScheduleView setView={setAppView} data={mockScheduleData} />;
            default:
                return <LandingView setView={setAppView} />;
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {renderView()}
        </div>
    );
};

export default App;