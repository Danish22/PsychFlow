
import React from 'react';
import { Card, SectionHeader, Button, Badge } from '../components/UI';

const Clinic: React.FC = () => {
  const therapists = [
    { name: 'Dr. Sarah Thompson', role: 'Clinical Lead', load: 24, revenue: '$8,240', status: 'Online' },
    { name: 'Marcus Avery, LCSW', role: 'Therapist', load: 18, revenue: '$4,100', status: 'In Session' },
    { name: 'Dr. Elena Vance', role: 'Psychiatrist', load: 12, revenue: '$6,500', status: 'Away' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader 
        title="Clinic Management" 
        description="Monitor practice-wide performance and manage clinicians."
        action={<Button variant="primary">+ Add Clinician</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Clinic Revenue (MTD)</p>
          <p className="text-3xl font-black text-slate-900 mt-2">$18,840</p>
          <div className="flex items-center gap-1 text-emerald-600 text-xs mt-2 font-bold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            12.5% vs last month
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinic Caseload</p>
          <p className="text-3xl font-black text-slate-900 mt-2">54</p>
          <p className="text-xs text-slate-500 mt-2 font-medium">85% total capacity</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Compliance Audits</p>
          <p className="text-3xl font-black text-amber-600 mt-2">3</p>
          <p className="text-xs text-slate-500 mt-2 font-medium">Due in next 24 hours</p>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Clinician Directory</h3>
          <Button variant="outline" className="text-xs px-3 py-1.5">Export Performance Data</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Clinician</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Caseload</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Revenue (MTD)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {therapists.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">{t.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{t.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${(t.load / 30) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{t.load}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{t.revenue}</td>
                  <td className="px-6 py-4">
                    <Badge color={t.status === 'Online' ? 'emerald' : t.status === 'In Session' ? 'indigo' : 'slate'}>{t.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" className="text-xs">Manage</Button>
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

export default Clinic;
