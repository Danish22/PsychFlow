
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Toast } from '../components/UI';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { DUMMY_CLIENTS, DUMMY_SESSIONS } from '../dummyData';

const LiveSession: React.FC<{ sessionId: string; onEnd: (notes: string) => void }> = ({ sessionId, onEnd }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [insights, setInsights] = useState<{ type: string; content: string }[]>([]);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [scratchpad, setScratchpad] = useState('');
  
  const sessionData = DUMMY_SESSIONS.find(s => s.id === sessionId) || DUMMY_SESSIONS[0];
  const client = DUMMY_CLIENTS.find(c => c.id === sessionData.clientId);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startSession = async () => {
    setIsRecording(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = inputAudioContext;
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            
            sessionPromise.then((session) => {
              session.sendRealtimeInput({
                media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
              });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          // Play co-pilot audio if any
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(decode(audioData), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
          }

          if (message.serverContent?.outputTranscription) {
            setTranscription(prev => [...prev, message.serverContent!.outputTranscription!.text]);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e) => console.error(e),
        onclose: () => setIsRecording(false)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        inputAudioTranscription: {},
        systemInstruction: 'You are a silent clinical observer. Provide brief cues for the therapist in text format.'
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 text-white flex flex-col overflow-hidden">
      <div className="h-16 px-8 border-b border-white/10 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Badge color="rose">Active Live Session</Badge>
          <h2 className="font-bold text-lg">{client?.name} <span className="text-white/40 font-normal">| Psychotherapy</span></h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Live Recording</span>
          </div>
          <Button variant="danger" className="bg-rose-600" onClick={() => onEnd(scratchpad)}>End Session</Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="relative aspect-video bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-50 grayscale" alt="Client" />
            {!isRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <Button onClick={startSession} variant="primary" className="h-14 px-8">Enable Clinical Co-pilot</Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-white/5 p-6 h-48 overflow-y-auto">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4">Live Transcript</h4>
              <div className="space-y-2 text-xs text-slate-300">
                {transcription.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            </Card>
            <Card className="bg-slate-800/50 border-white/5 p-6 h-48">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4">Therapist Notes</h4>
              <textarea 
                value={scratchpad} 
                onChange={(e) => setScratchpad(e.target.value)} 
                className="w-full h-24 bg-transparent outline-none resize-none text-sm"
                placeholder="Type session markers here..."
              />
            </Card>
          </div>
        </div>

        <div className="w-96 border-l border-white/10 bg-slate-900 p-8 flex flex-col gap-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Clinical Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-300">Listening for somatic markers and cognitive distortions...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
