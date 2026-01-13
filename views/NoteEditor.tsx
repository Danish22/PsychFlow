
import React, { useState, useEffect } from 'react';
import { Card, SectionHeader, Button, Badge, Toast, Modal } from '../components/UI';
import { DUMMY_CLIENTS, DUMMY_SESSIONS } from '../dummyData';
import { NoteType } from '../types';
import { generateNoteFromBullets, suggestProgressSummary, alignWithGoals } from '../services/geminiService';

const NoteEditor: React.FC<{ initialBullets?: string }> = ({ initialBullets = '' }) => {
  const [activeType, setActiveType] = useState<NoteType>(NoteType.SOAP);
  const [bullets, setBullets] = useState(initialBullets);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAligning, setIsAligning] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalAnalysis, setGoalAnalysis] = useState<any[]>([]);
  const [noteContent, setNoteContent] = useState<any>({
    s: '', o: '', a: '', p: '', d: '', b: '', i: '', r: ''
  });

  useEffect(() => {
    if (initialBullets) setBullets(initialBullets);
  }, [initialBullets]);

  const currentSession = DUMMY_SESSIONS[0];
  const client = DUMMY_CLIENTS.find(c => c.id === currentSession.clientId);

  const handleAICompose = async () => {
    if (!bullets.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateNoteFromBullets(bullets, activeType);
      setNoteContent(result);
    } catch (err) {
      alert("Failed to generate note. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestSummary = async () => {
    const fullContent = Object.values(noteContent).filter(Boolean).join(' ');
    if (!fullContent) {
      alert("Add some content to the note first.");
      return;
    }
    setIsSummarizing(true);
    try {
      const summary = await suggestProgressSummary(fullContent);
      setToastMsg(`AI Summary Suggestion: ${summary}`);
      setShowToast(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGoalAlignment = async () => {
    const fullContent = Object.values(noteContent).filter(Boolean).join(' ');
    if (!fullContent || !client) return;
    setIsAligning(true);
    try {
      const analysis = await alignWithGoals(fullContent, client.treatmentGoals);
      setGoalAnalysis(analysis);
      setShowGoalModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAligning(false);
    }
  };

  const handleLockNote = () => {
    setToastMsg("Clinical note has been locked and digitally signed.");
    setShowToast(true);
  };

  interface FieldDefinition {
    key: string;
    label: string;
    desc: string;
  }

  const getFields = (): FieldDefinition[] => {
    switch (activeType) {
      case NoteType.DAP:
        return [
          { key: 'd', label: 'Data', desc: 'Observations and information gathered.' },
          { key: 'a', label: 'Assessment', desc: 'Clinical interpretation of the data.' },
          { key: 'p', label: 'Plan', desc: 'Future sessions and goals.' }
        ];
      case NoteType.BIRP:
        return [
          { key: 'b', label: 'Behavior', desc: 'Client behavior and clinical observations.' },
          { key: 'i', label: 'Intervention', desc: 'Therapeutic interventions used.' },
          { key: 'r', label: 'Response', desc: 'Client response to interventions.' },
          { key: 'p', label: 'Plan', desc: 'Future sessions and homework.' }
        ];
      case NoteType.SOAP:
      default:
        return [
          { key: 's', label: 'Subjective', desc: "Client's perspective, mood, and reported symptoms." },
          { key: 'o', label: 'Objective', desc: 'Measurable observations, mental status exam, behavior.' },
          { key: 'a', label: 'Assessment', desc: 'Clinical synthesis, diagnosis update, and progress.' },
          { key: 'p', label: 'Plan', desc: 'Future sessions, homework, and treatment goal alignment.' }
        ];
    }
  };

  const fields = getFields();

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full gap-6 pb-20">
      <SectionHeader 
        title="Session Documentation" 
        description={`Clinical note for ${client?.name} - ${currentSession.date}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline">Save as Draft</Button>
            <Button variant="primary" onClick={handleLockNote}>Lock & Sign Note</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left: Editor */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-1">
            <div className="flex bg-slate-50 p-1 rounded-t-lg border-b border-slate-200">
              {Object.values(NoteType).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                    activeType === type ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            <div className="p-6 space-y-6">
              {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest">{field.label}</label>
                    <span className="text-[10px] text-slate-400 italic">{field.desc}</span>
                  </div>
                  <textarea
                    value={noteContent[field.key] || ''}
                    onChange={(e) => setNoteContent({ ...noteContent, [field.key]: e.target.value })}
                    className="w-full min-h-[140px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm text-slate-700 resize-none leading-relaxed"
                    placeholder={`Enter ${field.label.toLowerCase()} details...`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: AI Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-indigo-600 text-white p-6 border-none shadow-indigo-100 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Clinical Assist
            </h3>
            
            <div className="space-y-4">
              <p className="text-indigo-100 text-xs font-medium leading-relaxed">Draft your raw session observations below. Our AI will structure them into a compliant medical note.</p>
              
              <textarea
                value={bullets}
                onChange={(e) => setBullets(e.target.value)}
                placeholder="Ex: Patient reported feeling 'lighter'. Focus on breathing. Homework: 5 mins meditation daily..."
                className="w-full h-44 bg-indigo-500/30 border border-indigo-400/50 rounded-xl p-4 text-xs text-white placeholder-indigo-200 outline-none focus:bg-indigo-500/50 transition-all resize-none shadow-inner"
              />

              <Button 
                variant="secondary" 
                className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-none h-11"
                onClick={handleAICompose}
                disabled={isGenerating || !bullets.trim()}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Drafting Note...
                  </span>
                ) : 'Auto-Compose Note'}
              </Button>
              
              <div className="pt-6 border-t border-indigo-500/30">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-3 opacity-60">Clinical Intelligence</h4>
                <div className="space-y-2">
                  <button 
                    disabled={isSummarizing}
                    onClick={handleSuggestSummary}
                    className="w-full text-left p-3 rounded-lg hover:bg-indigo-500/30 transition-all text-xs flex items-center justify-between group disabled:opacity-50"
                  >
                    <span>{isSummarizing ? 'Summarizing...' : 'Suggest Progress Summary'}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button 
                    disabled={isAligning}
                    onClick={handleGoalAlignment}
                    className="w-full text-left p-3 rounded-lg hover:bg-indigo-500/30 transition-all text-xs flex items-center justify-between group disabled:opacity-50"
                  >
                    <span>{isAligning ? 'Aligning...' : 'Link to Treatment Goals'}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Treatment Objectives
            </h4>
            <div className="space-y-3">
              {client?.treatmentGoals.map((goal, i) => (
                <div key={i} className="flex gap-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-indigo-400 font-bold">{i + 1}.</span>
                  {goal}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        title="AI Treatment Goal Analysis"
        footer={<Button onClick={() => setShowGoalModal(false)}>Confirm & Save Alignment</Button>}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 italic">Gemini has analyzed your clinical session and identified progress on the following goals:</p>
          <div className="space-y-3">
            {goalAnalysis.map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border ${item.addressed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 grayscale opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${item.addressed ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {item.addressed ? 'Addressed in Session' : 'Not Addressed'}
                  </span>
                  {item.addressed && <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">{item.goal}</p>
                {item.rationale && <p className="text-xs text-slate-600 leading-relaxed">{item.rationale}</p>}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};

export default NoteEditor;
