
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Studio from './components/Studio';
import LiveCoach from './components/LiveCoach';
import Gallery from './components/Gallery';
import Help from './components/Help';
import Portfolio from './components/Portfolio';
import Toast, { ToastType } from './components/Toast';
import { AppSection } from './types';

const App: React.FC = () => {
  // Set default section to Portfolio as requested
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.PORTFOLIO);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  const renderContent = () => {
    switch (currentSection) {
      case AppSection.PORTFOLIO:
        return <Portfolio />;
      case AppSection.DASHBOARD:
        return <Dashboard />;
      case AppSection.STUDIO:
        return <Studio showToast={showToast} />;
      case AppSection.LIVE_COACH:
        return <LiveCoach />;
      case AppSection.GALLERY:
        return <Gallery />;
      case AppSection.HELP:
        return <Help />;
      case AppSection.SETTINGS:
        return (
          <div className="max-w-2xl mx-auto glass-morphism p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Application Settings</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 transition-colors hover:border-slate-700">
                <div>
                  <p className="font-semibold text-slate-200">Gemini 3 Pro Strategy</p>
                  <p className="text-sm text-slate-500">Enable advanced thinking budgets for content.</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <div>
                  <p className="font-semibold text-slate-200">Local Data Encryption</p>
                  <p className="text-sm text-slate-500">Enable client-side obfuscation of campaign data.</p>
                </div>
                <div className="w-12 h-6 bg-slate-700 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-slate-500 rounded-full" />
                </div>
              </div>
              <button 
                onClick={() => { localStorage.clear(); showToast('Storage wiped successfully', 'success'); }}
                className="w-full py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl text-sm font-bold transition-all"
              >
                Clear All Local Data
              </button>
            </div>
          </div>
        );
      default:
        return <Portfolio />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex selection:bg-indigo-500/30">
      <Sidebar 
        currentSection={currentSection} 
        onNavigate={setCurrentSection} 
      />
      
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-12 animate-in fade-in duration-1000">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">CAPACITI Showcase</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Londiwe Nxele <span className="text-indigo-500">Portfolio</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-200">AI Solutions Lead</p>
              <p className="text-xs text-slate-500">Capstone Final Project</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-500 border border-white/10 shadow-lg shadow-indigo-500/20" />
          </div>
        </header>

        <div className="pb-12">
          {renderContent()}
        </div>
      </main>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;
