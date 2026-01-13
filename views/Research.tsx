
import React, { useState } from 'react';
import { Card, SectionHeader, Button, Input } from '../components/UI';
import { searchClinicalInfo } from '../services/geminiService';

const Research: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string, citations: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const data = await searchClinicalInfo(query);
      setResults(data);
    } catch (error) {
      alert("Research tool error. Ensure your API key is configured correctly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Clinical Research" 
        description="Verify clinical data, check drug interactions, or look up recent papers using Gemini Search Grounding."
      />

      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Current best practices for treating adolescent ADHD with co-morbid anxiety"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()} className="h-12 px-8">
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 text-sm font-medium">Grounding response with verified search data...</p>
        </div>
      )}

      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Clinical Intelligence Response
            </h3>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm">
              {results.text.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </Card>

          {results.citations.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Verified Sources & Citations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.citations.map((chunk, i) => (
                  <a 
                    key={i} 
                    href={chunk.web?.uri || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{chunk.web?.title || 'External Reference'}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-1">{chunk.web?.uri || 'No URL available'}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Research;
