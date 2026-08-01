import React, { useState } from 'react';
import { AppView, Assignment, ScheduleData, Priority } from '../types';
import { HomeIcon, RightArrowIcon, CalendarIcon, PlusIcon } from './icons';

interface ScheduleViewProps {
  setView: (view: AppView) => void;
  data: ScheduleData;
}

const priorityStyles: { [key in Priority]: { bg: string; text: string; ring: string } } = {
  High: { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-600/20' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-600/20' },
  Low: { bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-600/20' },
};

const AddAssignmentModal: React.FC<{
  onClose: () => void;
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'completed'>) => void;
}> = ({ onClose, onAddAssignment }) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      alert('Please provide at least a title and a due date.');
      return;
    }
    // Add T00:00:00 to handle timezone issues, ensuring the date is interpreted in local time.
    onAddAssignment({
      title,
      course,
      dueDate: new Date(dueDate + 'T00:00:00'),
      priority,
    });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Problem Set 5" required/>
                </div>
                 <div className="mb-4">
                    <label htmlFor="course" className="block text-sm font-medium text-slate-600 mb-1">Course (Optional)</label>
                    <input id="course" type="text" value={course} onChange={(e) => setCourse(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., MATH-201"/>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-slate-600 mb-1">Due Date</label>
                        <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required/>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-slate-600 mb-1">Priority</label>
                        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">Add Assignment</button>
                </div>
            </form>
        </div>
    </div>
  );
};


const ScheduleView: React.FC<ScheduleViewProps> = ({ setView, data }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(data.assignments);
  const [showModal, setShowModal] = useState(false);

  const toggleComplete = (id: number) => {
    setAssignments(
      assignments.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };
  
  const handleAddAssignment = (newAssignmentData: Omit<Assignment, 'id' | 'completed'>) => {
    const newAssignment: Assignment = {
      ...newAssignmentData,
      id: Date.now(), // Use timestamp for a simple unique ID
      completed: false,
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  return (
    <div className="min-h-screen bg-slate-50">
        {showModal && <AddAssignmentModal onClose={() => setShowModal(false)} onAddAssignment={handleAddAssignment} />}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Assignment & Schedule</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView(AppView.LANDING)}
              className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <HomeIcon /> Home
            </button>
            <button
              onClick={() => setView(AppView.DASHBOARD)}
              className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
                <RightArrowIcon /> Dashboard
            </button>
            <button
              onClick={() => setView(AppView.STUDY)}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Go to Study <RightArrowIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Assignments */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Upcoming Assignments</h2>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                <PlusIcon /> Add Assignment
            </button>
          </div>
          <div className="space-y-3">
            {assignments.length > 0 ? (
                assignments
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .map((a) => (
                <div
                    key={a.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${a.completed ? 'bg-slate-50 opacity-60' : 'bg-white'}`}
                >
                    <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        checked={a.completed}
                        onChange={() => toggleComplete(a.id)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                        <p className={`font-semibold ${a.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {a.title}
                        </p>
                        <p className="text-sm text-slate-500">{a.course}</p>
                    </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${priorityStyles[a.priority].bg} ${priorityStyles[a.priority].text} ${priorityStyles[a.priority].ring}`}>{a.priority}</span>
                        <p className="text-sm font-medium text-slate-600 w-24 text-right">{a.dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
                </div>
                ))
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                    <p className="text-slate-500 font-medium">No upcoming assignments.</p>
                    <p className="text-sm text-slate-400 mt-1">Click "Add Assignment" to get started!</p>
                </div>
            )}
          </div>
        </div>
        
        {/* Weekly Calendar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><CalendarIcon /> Weekly View</h2>
             <div className="grid grid-cols-1 gap-2">
                {weekDays.map(day => {
                    const dayAssignments = assignments.filter(a => a.dueDate.toDateString() === day.toDateString() && !a.completed);
                    const isToday = day.toDateString() === today.toDateString();
                    return (
                        <div key={day.toISOString()} className={`p-3 rounded-lg ${isToday ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-slate-50'}`}>
                            <p className={`font-semibold text-sm ${isToday ? 'text-blue-700' : 'text-slate-600'}`}>{day.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                            {dayAssignments.length > 0 ? (
                                <ul className="mt-2 space-y-1">
                                    {dayAssignments.map(a => (
                                        <li key={a.id} className="text-xs text-slate-700 bg-white p-1.5 rounded border border-slate-200">{a.title}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-slate-400 mt-1">No assignments due.</p>
                            )}
                        </div>
                    )
                })}
             </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleView;