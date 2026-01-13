
import React, { useState } from 'react';
import { Card, SectionHeader, Button, Badge, Modal, Input } from '../components/UI';
import { DUMMY_SESSIONS, DUMMY_CLIENTS } from '../dummyData';
import { SessionMode } from '../types';

const Calendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    mode: SessionMode.VIDEO,
    fee: '150'
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  const handleCreate = () => {
    // In a real app, this would send to an API
    console.log('Creating session:', formData);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader 
        title="Calendar" 
        description="Schedule and manage your therapy sessions."
        action={<Button variant="primary" onClick={() => setIsModalOpen(true)}>+ New Appointment</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day) => (
          <div key={day} className="space-y-4">
            <div className={`p-3 text-center border-b-2 ${day === today ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-slate-200 text-slate-500 font-medium'}`}>
              {day}
            </div>
            
            <div className="space-y-3 min-h-[600px] bg-slate-50/50 rounded-xl p-2 border border-slate-100 border-dashed">
              {DUMMY_SESSIONS.filter(s => {
                const sessionDate = new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' });
                return sessionDate === day;
              }).map(session => {
                const client = DUMMY_CLIENTS.find(c => c.id === session.clientId);
                return (
                  <Card key={session.id} className="p-3 border-l-4 border-l-indigo-500 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {session.startTime} - {session.endTime}
                      </span>
                      <Badge color={session.mode === SessionMode.VIDEO ? 'indigo' : 'emerald'}>
                        {session.mode === SessionMode.VIDEO ? 'V' : 'P'}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">{client?.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Notes pending</p>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Schedule New Appointment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create Appointment</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Client" as="select" value={formData.clientId} onChange={(e) => setFormData({...formData, clientId: e.target.value})}>
            <option value="">Select a client...</option>
            {DUMMY_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Input>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            <Input label="Start Time" type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Session Mode" as="select" value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value as SessionMode})}>
              {Object.values(SessionMode).map(mode => <option key={mode} value={mode}>{mode}</option>)}
            </Input>
            <Input label="Session Fee ($)" type="number" value={formData.fee} onChange={(e) => setFormData({...formData, fee: e.target.value})} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
