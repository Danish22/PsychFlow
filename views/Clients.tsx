
import React, { useState } from 'react';
import { Card, SectionHeader, Button, Badge, Input } from '../components/UI';
import { DUMMY_CLIENTS, DUMMY_SESSIONS, DUMMY_ASSESSMENTS } from '../dummyData';
import { Client } from '../types';

const Clients: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'outcomes' | 'plan'>('overview');

  const filteredClients = DUMMY_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedClient) {
    const clientSessions = DUMMY_SESSIONS.filter(s => s.clientId === selectedClient.id);
    const clientAssessments = DUMMY_ASSESSMENTS.filter(a => a.clientId === selectedClient.id);

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => { setSelectedClient(null); setActiveTab('overview'); }} className="mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Client List
        </Button>

        <SectionHeader 
          title={selectedClient.name} 
          description={`Born ${new Date(selectedClient.dateOfBirth).toLocaleDateString()}`}
          action={<Button variant="primary">Edit Profile</Button>}
        />

        <div className="flex border-b border-slate-200 mb-6">
          {(['overview', 'sessions', 'outcomes', 'plan'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.replace('plan', 'Treatment Plan')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                <Card className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Clinical Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Diagnosis</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedClient.diagnosis.map(d => <Badge key={d} color="indigo">{d}</Badge>)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intake Summary</label>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{selectedClient.intakeSummary}"</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Treatment Goals</label>
                      <div className="space-y-2 mt-2">
                        {selectedClient.treatmentGoals.map((g, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <div className="w-5 h-5 rounded-full border-2 border-indigo-200 flex-shrink-0" />
                            <span className="text-sm text-slate-700">{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'sessions' && (
              <Card className="overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Summary</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {clientSessions.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{new Date(s.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{s.summary}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">${s.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {activeTab === 'outcomes' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-bold text-slate-900 mb-6">Symptom Progress (GAD-7)</h3>
                  <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-l border-slate-100">
                    {clientAssessments.map((a, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                        <div 
                          className="w-full bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-600 group-hover:scale-105" 
                          style={{ height: `${(a.score / 21) * 100}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Score: {a.score}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">{new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">Current Score</p>
                      <p className="text-2xl font-black text-emerald-900 mt-1">{clientAssessments[clientAssessments.length-1]?.score || 0}</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <p className="text-[10px] font-bold text-indigo-600 uppercase">Change Since Intake</p>
                      <p className="text-2xl font-black text-indigo-900 mt-1">
                        -{((clientAssessments[0]?.score || 0) - (clientAssessments[clientAssessments.length-1]?.score || 0))} pts
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'plan' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900">Active Treatment Plan</h3>
                    <Button variant="outline" className="text-xs">AI Goal Generator</Button>
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Primary Focus</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">Alleviating acute generalized anxiety through cognitive behavioral interventions and mindfulness-based stress reduction.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Interventions</h4>
                      <div className="space-y-3">
                        {['Cognitive Restructuring', 'Somatic Grounding', 'Exposure Therapy (Graded)'].map(tool => (
                          <div key={tool} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-indigo-400" />
                            <span className="text-sm text-slate-700 font-medium">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Contact Details</h3>
              <div className="space-y-3">
                <p className="text-sm text-slate-500 flex justify-between">Email <span className="text-slate-900 font-medium">{selectedClient.email}</span></p>
                <p className="text-sm text-slate-500 flex justify-between">Phone <span className="text-slate-900 font-medium">{selectedClient.phone}</span></p>
                <p className="text-sm text-slate-500 flex justify-between">Balance <span className={`font-bold ${selectedClient.totalBalance && selectedClient.totalBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>${selectedClient.totalBalance?.toFixed(2) || '0.00'}</span></p>
              </div>
              <Button variant="outline" className="w-full mt-6">Secure Message</Button>
            </Card>

            <Card className="p-6 bg-slate-900 text-white">
              <h3 className="font-bold mb-4">Quick Notes</h3>
              <textarea 
                className="w-full h-32 bg-slate-800 border-none rounded-lg p-3 text-xs text-slate-200 resize-none focus:ring-1 focus:ring-indigo-500 outline-none" 
                placeholder="Add a quick internal reminder..."
              />
              <Button variant="secondary" className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700">Update Note</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader 
        title="Clients" 
        description="Manage your clinical patient records."
        action={<Button variant="primary">+ Add Client</Button>}
      />

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <Button variant="outline">Filters</Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Session</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedClient(client)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors text-sm">{client.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={client.status === 'Active' ? 'emerald' : 'slate'}>{client.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {client.lastSession ? new Date(client.lastSession).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">
                    <span className={client.totalBalance && client.totalBalance > 0 ? 'text-rose-600' : 'text-slate-900'}>
                      ${client.totalBalance?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-300 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Clients;
