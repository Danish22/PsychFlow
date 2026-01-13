
import React from 'react';
import { Card, SectionHeader, Button, Badge } from '../components/UI';
import { DUMMY_ASSESSMENTS, DUMMY_CLIENTS } from '../dummyData';

const Assessments: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader 
        title="Assessments & Outcomes" 
        description="Track clinical progress and standardized scores."
        action={<Button variant="outline">Schedule Assessment</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-indigo-50 border-indigo-100">
          <p className="text-xs font-bold text-indigo-600 uppercase">Avg. GAD-7 Change</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-indigo-900">-4.2</span>
            <span className="text-sm text-indigo-600 font-medium">pts this month</span>
          </div>
        </Card>
        <Card className="p-6 bg-emerald-50 border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 uppercase">Completion Rate</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-emerald-900">92%</span>
            <span className="text-sm text-emerald-600 font-medium">of scheduled</span>
          </div>
        </Card>
        <Card className="p-6 bg-amber-50 border-amber-100">
          <p className="text-xs font-bold text-amber-600 uppercase">Risk Alerts</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-amber-900">1</span>
            <span className="text-sm text-amber-600 font-medium">high-score alert</span>
          </div>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Assessment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DUMMY_ASSESSMENTS.map((assessment) => {
                const client = DUMMY_CLIENTS.find(c => c.id === assessment.clientId);
                return (
                  <tr key={assessment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(assessment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{client?.name}</td>
                    <td className="px-6 py-4">
                      <Badge color="slate">{assessment.type}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                      {assessment.score}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {assessment.interpretation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Assessments;
