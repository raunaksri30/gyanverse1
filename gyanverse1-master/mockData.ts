import type { DashboardData, ScheduleData } from './types';

export const mockDashboardData: DashboardData = {
    studyStreak: 12,
    totalXP: 2450,
    topicsMastered: 18,
    totalTopics: 25,
    studyTime: "24.5 hrs",
    focusAreas: [
        { topic: "Calculus - Integration", mastery: 45 },
        { topic: "Physics - Thermodynamics", mastery: 52 },
        { topic: "Chemistry - Organic Reactions", mastery: 61 },
    ],
    recentActivity: [
        { type: "Quiz", title: "Linear Algebra", details: "85%", timestamp: "2 hours ago" },
        { type: "Notes", title: "Thermodynamics", details: "Studied Notes", timestamp: "5 hours ago" },
        { type: "Quiz", title: "Organic Chemistry", details: "92%", timestamp: "Yesterday" },
        { type: "Upload", title: "Physics Chapter 5", details: "Upload Material", timestamp: "2 days ago" },
    ]
};

// Start with an empty list of assignments
export const mockScheduleData: ScheduleData = {
    assignments: []
};