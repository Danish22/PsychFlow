
import React, { useState } from 'react';
import { Card, SectionHeader, Button, Badge, Input } from '../components/UI';
import { DUMMY_DOCUMENTS, DUMMY_CLIENTS } from '../dummyData';

const Documents: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Consent' | 'Assessment' | 'Other'>('All');

  const filteredDocs = DUMMY_DOCUMENTS.filter(doc => activeFilter === 'All' || doc.type === activeFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SectionHeader 
        title="Document Center" 
        description="Securely manage clinical forms, signed consents, and templates."
        action={<Button variant="primary">+ Upload Document</Button>}
      />

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(['All', 'Consent', 'Assessment', 'Other'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
              activeFilter === filter 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          const client = DUMMY_CLIENTS.find(c => c.id === doc.clientId);
          return (
            <Card key={doc.id} className="p-6 hover:shadow-md transition-shadow group border-t-4 border-t-indigo-500">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <Badge color={doc.status === 'Signed' ? 'emerald' : 'amber'}>{doc.status}</Badge>
              </div>
              
              <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{doc.title}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {client ? `Client: ${client.name}` : 'Shared Practice Template'}
              </p>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-12 border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h3 className="font-bold text-slate-900">Drag and drop clinical files</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">Upload PDFs, signed consents, or assessment results directly to the patient record.</p>
        <Button variant="outline" className="mt-6">Choose Files</Button>
      </Card>
    </div>
  );
};

export default Documents;
