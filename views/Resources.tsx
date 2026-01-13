
import React, { useState } from 'react';
import { Card, SectionHeader, Button, Badge, Input, Toast } from '../components/UI';
import { generateHandout, generateHandoutAudio } from '../services/geminiService';

const Resources: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [focus, setFocus] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAudioGenerating, setIsAudioGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGenerate = async () => {
    if (!topic || !focus) return;
    setIsGenerating(true);
    try {
      const result = await generateHandout(topic, focus);
      setContent(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!content) return;
    setIsAudioGenerating(true);
    try {
      const base64Audio = await generateHandoutAudio(content);
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        
        // Decoding manual PCM as per guidelines
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAudioGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Resource Hub" 
        description="Generate custom psychoeducation materials and audio guides for your patients."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.711 2.133a2 2 0 01-1.185 1.185l-2.133.711a2 2 0 01-1.414-1.96l.477-2.387a2 2 0 00-.547-1.022L6.13 13.13a2 2 0 010-2.828l2.312-2.312a2 2 0 00.547-1.022l-.477-2.387a2 2 0 011.96-1.414l2.133.711a2 2 0 011.185 1.185l.711-2.133a2 2 0 012.828 0l2.312 2.312a2 2 0 001.022.547l2.387.477a2 2 0 011.414 1.96l-.711 2.133a2 2 0 01-1.185 1.185l-2.133.711a2 2 0 01-1.414-1.96l.477-2.387a2 2 0 00-.547-1.022L17.87 10.87a2 2 0 010 2.828l-2.312 2.312z" /></svg>
              AI Handout Generator
            </h3>
            <div className="space-y-4">
              <Input 
                label="Topic" 
                placeholder="e.g. Anxiety Management" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
              />
              <Input 
                label="Specific Focus" 
                as="textarea" 
                placeholder="e.g. Grounding techniques for panic attacks in public spaces" 
                value={focus} 
                onChange={(e) => setFocus(e.target.value)} 
              />
              <Button 
                variant="primary" 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={isGenerating || !topic || !focus}
              >
                {isGenerating ? 'Drafting Content...' : 'Generate Handout'}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Popular Templates</h4>
            <div className="space-y-2">
              {['Sleep Hygiene Checklist', 'CBT Thought Record', 'Mindfulness for Stress'].map(t => (
                <button 
                  key={t} 
                  className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center justify-between group"
                  onClick={() => { setTopic(t); setFocus('Evidence-based interventions for clinic use'); }}
                >
                  {t}
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {content ? (
            <Card className="p-8 min-h-[500px] animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <Badge color="indigo">Generated Resource</Badge>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePlayAudio} disabled={isAudioGenerating}>
                    {isAudioGenerating ? 'Processing Audio...' : 'Listen (TTS)'}
                  </Button>
                  <Button variant="secondary">Download PDF</Button>
                </div>
              </div>
              <div className="prose prose-slate max-w-none text-slate-700">
                {content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p className="font-medium">Define a topic to generate clinical handouts</p>
            </div>
          )}
        </div>
      </div>
      <Toast isVisible={showToast} message="Resource Added to Patient Portal" onClose={() => setShowToast(false)} />
    </div>
  );
};

export default Resources;
