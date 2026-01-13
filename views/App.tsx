
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard';
import NoteEditor from './NoteEditor';
import Clients from './Clients';
import Calendar from './Calendar';
import Assessments from './Assessments';
import Billing from './Billing';
import Settings from './Settings';
import Research from './Research';
import Clinic from './Clinic';
import LiveSession from './LiveSession';
import Messaging from './Messaging';
import Waitlist from './Waitlist';
import Documents from './Documents';
import Resources from './Resources';
import { Card, Button, Input } from '../components/UI';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [activeLiveSession, setActiveLiveSession] = useState<string | null>(null);
  const [prefilledNotes, setPrefilledNotes] = useState('');

  const startLiveSession = (id: string) => {
    setActiveLiveSession(id);
  };

  const endLiveSession = (notes: string) => {
    setPrefilledNotes(notes);
    setActiveLiveSession(null);
    setCurrentView('notes');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-indigo-200 mx-auto mb-6">P</div>
            <h1 className="text-3xl font-bold text-slate-900">
              {authMode === 'login' ? 'Welcome back' : authMode === 'signup' ? 'Create Practice' : 'Reset Password'}
            </h1>
            <p className="text-slate-500 mt-2">
              {authMode === 'login' ? 'Log in to manage your clinical practice' : authMode === 'signup' ? 'Start your solo practice management today' : 'Enter your email to receive a reset link'}
            </p>
          </div>
          
          <Card className="p-8">
            {authMode === 'login' && (
              <div className="space-y-6">
                <Input label="Email Address" placeholder="dr.smith@example.com" type="email" />
                <div className="space-y-1">
                  <Input label="Password" type="password" />
                  <button 
                    onClick={() => setAuthMode('forgot')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 block w-fit"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button variant="primary" className="w-full h-11" onClick={() => setIsAuthenticated(true)}>Sign In</Button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span></div>
                </div>
                <Button variant="outline" className="w-full">Sign in with Google</Button>
                <p className="text-center text-slate-500 text-sm">
                  Don't have an account? 
                  <button onClick={() => setAuthMode('signup')} className="text-indigo-600 font-bold ml-1 hover:underline">Start free trial</button>
                </p>
              </div>
            )}

            {authMode === 'signup' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="Sarah" />
                  <Input label="Last Name" placeholder="Thompson" />
                </div>
                <Input label="Clinical Email" placeholder="dr.thompson@example.com" type="email" />
                <Input label="License Number" placeholder="PSY-000000" />
                <Input label="Password" type="password" />
                <Button variant="primary" className="w-full h-11" onClick={() => setIsAuthenticated(true)}>Create Account</Button>
                <p className="text-center text-slate-500 text-sm">
                  Already have an account? 
                  <button onClick={() => setAuthMode('login')} className="text-indigo-600 font-bold ml-1 hover:underline">Log in</button>
                </p>
              </div>
            )}

            {authMode === 'forgot' && (
              <div className="space-y-6">
                <Input label="Account Email" placeholder="dr.smith@example.com" type="email" />
                <Button variant="primary" className="w-full h-11" onClick={() => { alert('Reset link sent!'); setAuthMode('login'); }}>Send Reset Link</Button>
                <button 
                  onClick={() => setAuthMode('login')}
                  className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600"
                >
                  Back to login
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onJoinSession={startLiveSession} />;
      case 'notes': return <NoteEditor initialBullets={prefilledNotes} />;
      case 'clients': return <Clients />;
      case 'calendar': return <Calendar />;
      case 'assessments': return <Assessments />;
      case 'billing': return <Billing />;
      case 'settings': return <Settings />;
      case 'research': return <Research />;
      case 'clinic': return <Clinic />;
      case 'messaging': return <Messaging />;
      case 'waitlist': return <Waitlist />;
      case 'documents': return <Documents />;
      case 'resources': return <Resources />;
      default: return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <h2 className="text-xl font-medium">View Not Found</h2>
          <Button variant="ghost" className="mt-4" onClick={() => setCurrentView('dashboard')}>Back to Dashboard</Button>
        </div>
      );
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {activeLiveSession && (
        <LiveSession sessionId={activeLiveSession} onEnd={endLiveSession} />
      )}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Clinical Practice</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-slate-900 capitalize font-semibold">{currentView.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Dr. Thompson</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Practice Admin</p>
              </div>
              <img src="https://picsum.photos/seed/doc/100" className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" alt="Profile" />
            </div>
          </div>
        </header>
        
        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
