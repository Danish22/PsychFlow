
import React, { useState } from 'react';
import { Card, SectionHeader, Button, Badge, Modal, Input } from '../components/UI';
import { DUMMY_WAITLIST } from '../dummyData';
import { WaitlistClient } from '../types';

const Waitlist: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waitlist, setWaitlist] = useState<WaitlistClient[]>(DUMMY_WAITLIST);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'rose';
      case 'Medium': return 'amber';
      case 'Low': return 'slate';
      default: return 'indigo';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader 
        title="Waitlist Management" 
        description="Track prospective clients and priority for intake."
        action={<Button variant="primary" onClick={() => setIsModalOpen(true)}>+ Add to Waitlist</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Waitlist</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{waitlist.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Wait Time</p>
          <p className="text-3xl font-black text-indigo-600 mt-2">14 Days</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">High Priority</p>
          <p className="text-3xl font-black text-rose-600 mt-2">
            {waitlist.filter(w => w.priority === 'High').length}
          </p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Prospective Client</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Added On</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Source</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {waitlist.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={getPriorityColor(item.priority)}>{item.priority}</Badge>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {new Date(item.addedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {item.referralSource}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" className="text-xs text-indigo-600 font-bold">Intake</Button>
                      <Button variant="ghost" className="text-xs text-slate-400">Remove</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add to Waitlist"
        footer={<Button variant="primary" onClick={() => setIsModalOpen(false)}>Save to Waitlist</Button>}
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="Prospective client name" />
          <Input label="Email" placeholder="client@example.com" />
          <Input label="Phone" placeholder="(555) 000-0000" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Priority" as="select">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Input>
            <Input label="Referral Source" placeholder="Zocdoc, Website, etc." />
          </div>
          <Input label="Inquiry Notes" as="textarea" placeholder="Brief summary of their inquiry..." />
        </div>
      </Modal>
    </div>
  );
};

export default Waitlist;
