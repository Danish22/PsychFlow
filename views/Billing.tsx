
import React from 'react';
import { Card, SectionHeader, Button, Badge } from '../components/UI';
import { DUMMY_INVOICES, DUMMY_CLIENTS } from '../dummyData';

const Billing: React.FC = () => {
  const packages = [
    { name: 'Introductory 6-Session Plan', price: '$850', savings: '10% off', client: 'Sarah Jenkins', progress: 4, total: 6 },
    { name: 'Wellness Monthly Subscription', price: '$600/mo', savings: 'Unlimited chat', client: 'Marcus Thorne', progress: 2, total: 4 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Billing & Invoices" 
        description="Manage session fees, client accounts, and prepaid packages."
        action={<Button variant="primary">Generate Bulk Invoices</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Outstanding', value: '$850', color: 'rose' },
          { label: 'Collected (30d)', value: '$5,240', color: 'emerald' },
          { label: 'Pending Drafts', value: '4', color: 'amber' },
          { label: 'Projected (30d)', value: '$6,800', color: 'indigo' },
        ].map(stat => (
          <Card key={stat.label} className={`p-4 border-l-4 border-l-${stat.color}-500`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 text-${stat.color}-600`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Recent Transactions</h3>
              <Button variant="ghost" className="text-xs">View all</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Invoice #</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Client</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Due Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DUMMY_INVOICES.map((inv) => {
                    const client = DUMMY_CLIENTS.find(c => c.id === inv.clientId);
                    const statusColors: Record<string, string> = {
                      Paid: 'emerald',
                      Sent: 'indigo',
                      Draft: 'slate',
                      Overdue: 'rose'
                    };
                    
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-slate-400">
                          {inv.id.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{client?.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(inv.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-right">
                          ${inv.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge color={statusColors[inv.status]}>{inv.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
              Active Packages
              <Button variant="ghost" className="p-0 text-indigo-600 font-bold text-xs h-auto">+ New</Button>
            </h3>
            <div className="space-y-4">
              {packages.map((pkg, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-indigo-100 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{pkg.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Assigned to: {pkg.client}</p>
                    </div>
                    <span className="text-xs font-black text-indigo-600">{pkg.price}</span>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span>Progress</span>
                      <span>{pkg.progress} / {pkg.total} Sessions</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(pkg.progress / pkg.total) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white">
            <h3 className="font-bold mb-4">Payout Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-xs text-slate-400">Next Payout</span>
                <span className="text-xs font-bold">May 25, 2024</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-xs text-slate-400">Available Balance</span>
                <span className="text-lg font-black text-emerald-400">$3,420.00</span>
              </div>
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 border-none">Initiate Manual Payout</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;
