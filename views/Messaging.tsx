
import React, { useState } from 'react';
import { Card, SectionHeader, Button, Badge } from '../components/UI';
import { DUMMY_CLIENTS } from '../dummyData';

const Messaging: React.FC = () => {
  const [activeChat, setActiveChat] = useState(DUMMY_CLIENTS[0].id);
  const selectedClient = DUMMY_CLIENTS.find(c => c.id === activeChat);

  const mockMessages = [
    { sender: 'client', text: "Hi Dr. Thompson, I'm feeling a bit overwhelmed by the homework this week.", time: '9:41 AM' },
    { sender: 'therapist', text: "I understand, Sarah. It's perfectly okay to take it slow. Which part feels most challenging?", time: '10:05 AM' },
    { sender: 'client', text: "Mainly the daily journaling. I struggle to find a quiet moment.", time: '10:12 AM' },
  ];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex gap-6 animate-in fade-in duration-500">
      {/* Sidebar: Chat List */}
      <div className="w-80 flex flex-col gap-4 h-full">
        <SectionHeader title="Messages" />
        <Card className="flex-1 overflow-y-auto p-2 space-y-1">
          {DUMMY_CLIENTS.map(client => (
            <button
              key={client.id}
              onClick={() => setActiveChat(client.id)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                activeChat === client.id ? 'bg-indigo-50 border border-indigo-100 shadow-sm' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs">
                {client.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-slate-900 truncate">{client.name}</p>
                  <span className="text-[10px] text-slate-400">10:12 AM</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">Mainly the daily journaling...</p>
              </div>
            </button>
          ))}
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {selectedClient?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{selectedClient?.name}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-xs px-3">Secure Document</Button>
              <Button variant="ghost" className="p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
              </Button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {mockMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'therapist' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'therapist' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-medium px-1 uppercase tracking-tighter">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
              <button className="text-slate-400 hover:text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>
              <input 
                type="text" 
                placeholder="Type a secure message..." 
                className="flex-1 bg-transparent py-2 outline-none text-sm text-slate-700"
              />
              <Button variant="primary" className="p-2 rounded-xl h-10 w-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              AES-256 End-to-End Encrypted HIPAA Compliant Session
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messaging;
