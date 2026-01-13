
import React from 'react';
import { Card, SectionHeader, Badge, Button } from '../components/UI';
import { DUMMY_SESSIONS, DUMMY_CLIENTS, DUMMY_WAITLIST } from '../dummyData';

const Dashboard: React.FC<{ onJoinSession?: (id: string) => void }> = ({ onJoinSession }) => {
  const stats = [
    { label: 'Active Clients', value: '24', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'indigo' },
    { label: 'Waitlisted', value: DUMMY_WAITLIST.length.toString(), icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
    { label: 'Pending Notes', value: '4', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'emerald' },
    { label: 'Outstanding Fees', value: '$850', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'rose' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Good morning, Dr. Thompson" 
        description="Here's what your practice looks like today."
        action={<Button variant="primary">+ New Session</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
              Today's Schedule
              <span className="text-sm font-normal text-slate-500">Wednesday, May 22</span>
            </h3>
            <div className="space-y-4">
              {DUMMY_SESSIONS.map((session) => {
                const client = DUMMY_CLIENTS.find(c => c.id === session.clientId);
                return (
                  <div key={session.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                    <div className="w-16 text-sm font-medium text-slate-400 pt-0.5">
                      {session.startTime}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{client?.name}</h4>
                        <Badge color={session.mode === 'Video' ? 'indigo' : 'emerald'}>{session.mode}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">{session.summary}</p>
                    </div>
                    {session.mode === 'Video' && (
                      <Button 
                        variant="secondary" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600 hover:bg-emerald-700" 
                        onClick={() => onJoinSession?.(session.id)}
                      >
                        Join Session
                      </Button>
                    )}
                  </div>
                );
              })}
              {DUMMY_SESSIONS.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  No sessions scheduled for today.
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Practice Alerts
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm font-semibold text-amber-800">4 Pending Notes</p>
                <p className="text-xs text-amber-700 mt-1">Clinical documentation is overdue for several sessions.</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-semibold text-indigo-800">New Waitlist Inquiry</p>
                <p className="text-xs text-indigo-700 mt-1">Clarissa Moon has requested an OCD intake assessment.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
