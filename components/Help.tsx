
import React from 'react';
import { Shield, Zap, Terminal, FileCode, CheckCircle, AlertTriangle, BookOpen, FolderArchive, Layers, Share2, Info } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black mb-4">Technical Specification</h2>
          <p className="text-slate-400 tracking-tight">Standardized Capstone Documentation & System Design</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="px-4 py-2 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest">
            v2.1.0-CAPSTONE
          </div>
          <p className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">Project Authenticity Verified</p>
        </div>
      </div>

      {/* System Architecture Section */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-200">
          <Layers className="text-indigo-400" /> System Architecture
        </h3>
        <div className="glass-morphism p-8 rounded-3xl border border-white/5 space-y-8 bg-slate-900/40">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex-1 space-y-2">
               <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                 <Share2 size={18} className="text-indigo-400" /> Orchestration Workflow
               </h4>
               <p className="text-sm text-slate-400 leading-relaxed">
                 The application utilizes a <strong>Sequential Pipeline Pattern</strong>. A single user seed propagates through five specialized AI nodes. State is managed via a centralized Campaign object, ensuring data consistency across text, visual, and audio modalities.
               </p>
             </div>
             <div className="shrink-0 bg-slate-950 p-6 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] font-bold">NODE 1</div>
                  <div className="flex items-center text-slate-700">→</div>
                  <div className="w-8 h-8 rounded-md bg-purple-600 flex items-center justify-center text-[10px] font-bold">NODE 2</div>
                  <div className="flex items-center text-slate-700">→</div>
                  <div className="w-8 h-8 rounded-md bg-rose-600 flex items-center justify-center text-[10px] font-bold">NODE 3</div>
                </div>
                <p className="text-[9px] text-center mt-3 text-slate-500 font-bold">MODALITY SYNCED</p>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-3">
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Grounding Layer</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Utilizes <strong>Google Search Grounding</strong> to inject real-time context into the Gemini 3 Pro reasoning engine, preventing hallucinations in market research.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-black text-rose-400 uppercase tracking-widest">Rendering Tier</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Asynchronous processing for <strong>Veo (Video)</strong> and <strong>Flash (Image)</strong> generation with polling mechanisms to handle high-latency operations.
                </p>
              </div>
           </div>
        </div>
      </section>

      {/* Presentation Delivery Section */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-200">
          <Terminal className="text-emerald-400" /> Technical Communication
        </h3>
        <div className="glass-morphism p-8 rounded-3xl border border-white/5 space-y-6 bg-gradient-to-r from-slate-900/50 to-emerald-950/10">
          <div className="flex gap-4">
             <div className="w-1 bg-emerald-500 rounded-full" />
             <div>
               <h4 className="font-bold text-slate-100 mb-2">Presentation Script Guidelines</h4>
               <p className="text-sm text-slate-400 leading-relaxed">
                 When presenting this capstone, focus on the <strong>Value Chain</strong>: how AI reduces human labor from weeks of research to seconds of execution. Use the built-in "Pitch Script" generator in the Studio to create tailored demonstration scripts.
               </p>
             </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Shield className="text-indigo-400" /> Security & Compliance
        </h3>
        <div className="glass-morphism p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-300">
             <Info size={16} />
             <p className="text-xs font-bold uppercase tracking-widest">Security Audit Log</p>
          </div>
          <p className="text-sm text-slate-300">
            <strong>Key Management:</strong> The application supports dynamic <strong>Paid Key Selection</strong> for enterprise models (Veo), ensuring zero-leakage of developer credentials during client demonstrations.
          </p>
          <p className="text-sm text-slate-300">
            <strong>Browser Sandboxing:</strong> All PII and creative assets are restricted to the <code>localStorage</code> domain, adhering to strict client-side isolation principles.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FolderArchive className="text-amber-400" /> Bootcamp Project Archive
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-morphism p-6 rounded-2xl border border-white/5 flex flex-col gap-2 hover:border-white/10 transition-all group">
            <div className="flex justify-between">
              <span className="text-[10px] font-black text-indigo-400 uppercase">Module 1: Layout</span>
              <span className="text-[10px] text-slate-500 font-bold">GRADE: 100%</span>
            </div>
            <p className="font-bold text-slate-200">Responsive Architecture</p>
            <p className="text-xs text-slate-400">Implementation of CSS Flexbox/Grid for high-density data visualizations.</p>
          </div>
          <div className="glass-morphism p-6 rounded-2xl border border-white/5 flex flex-col gap-2 hover:border-white/10 transition-all group">
            <div className="flex justify-between">
              <span className="text-[10px] font-black text-indigo-400 uppercase">Module 2: Interaction</span>
              <span className="text-[10px] text-slate-500 font-bold">GRADE: 100%</span>
            </div>
            <p className="font-bold text-slate-200">Dynamic State Engine</p>
            <p className="text-xs text-slate-400">Complex React state management across multi-step wizard interfaces.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
