
import React, { useState } from 'react';
import { Sparkles, FileText, Image as ImageIcon, Volume2, Send, Loader2, Play, Download, Search, CheckCircle2, Globe, Film, Mic } from 'lucide-react';
import { generateMarketInsights, generateCampaignText, generateCampaignImage, generateCampaignAudio, generateCampaignVideo, generatePitchScript, decodePCM } from '../services/geminiService';
import { saveCampaign } from '../services/storageService';
import { ContentAsset, Campaign } from '../types';
import { ToastType } from './Toast';

interface StudioProps {
  showToast: (msg: string, type?: ToastType) => void;
}

const Studio: React.FC<StudioProps> = ({ showToast }) => {
  const [seed, setSeed] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [marketData, setMarketData] = useState<{text: string, sources: any[]} | null>(null);
  const [includeVideo, setIncludeVideo] = useState(false);

  const steps = [
    { id: 1, label: 'Research', icon: Search },
    { id: 2, label: 'Analysis', icon: FileText },
    { id: 3, label: 'Spec Sheet', icon: Mic },
    { id: 4, label: 'Visuals', icon: ImageIcon },
    { id: 5, label: 'Audio Guide', icon: Volume2 },
    ...(includeVideo ? [{ id: 6, label: 'Showcase', icon: Film }] : []),
  ];

  const createWavBlob = (base64Pcm: string): Blob => {
    const pcmData = decodePCM(base64Pcm);
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    const sampleRate = 24000;
    const numChannels = 1;

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, pcmData.length, true);

    const combined = new Uint8Array(header.byteLength + pcmData.length);
    combined.set(new Uint8Array(header), 0);
    combined.set(pcmData, header.byteLength);

    return new Blob([combined], { type: 'audio/wav' });
  };

  const handleDownload = (asset: ContentAsset) => {
    try {
      const link = document.createElement('a');
      let url = asset.content;
      let filename = `${asset.title.replace(/\s+/g, '_').toLowerCase()}`;

      if (asset.type === 'text' || asset.type === 'pitch') {
        const blob = new Blob([asset.content], { type: 'text/markdown' });
        url = URL.createObjectURL(blob);
        filename += '.md';
      } else if (asset.type === 'audio') {
        const blob = createWavBlob(asset.content);
        url = URL.createObjectURL(blob);
        filename += '.wav';
      } else if (asset.type === 'image') {
        filename += '.png';
      } else if (asset.type === 'video') {
        filename += '.mp4';
      }

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (asset.type === 'text' || asset.type === 'pitch' || asset.type === 'audio') {
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
      showToast(`Downloading ${asset.title}...`, 'success');
    } catch (err) {
      console.error('Download failed:', err);
      showToast('Download failed. Please try again.', 'error');
    }
  };

  const handleGenerate = async () => {
    if (!seed.trim()) return;

    if (includeVideo) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        showToast("Accessing paid tier for video...", "info");
        await window.aistudio.openSelectKey();
      }
    }

    setIsGenerating(true);
    setAssets([]);
    setMarketData(null);
    showToast("Launching Gadget Intelligence pipeline", "info");
    
    try {
      const tempAssets: ContentAsset[] = [];

      // STEP 1: Research
      setCurrentStep(1);
      setStatusMsg("Researching gadget specifications and market data...");
      const insights = await generateMarketInsights(seed);
      setMarketData(insights);
      tempAssets.push({
        id: 'market-1', type: 'text', title: 'Market Intelligence', content: insights.text,
        createdAt: new Date(), status: 'completed', metadata: { sources: insights.sources }
      });

      // STEP 2: Text
      setCurrentStep(2);
      setStatusMsg("Analyzing features and user sentiment...");
      const textContent = await generateCampaignText(seed, insights.text);
      tempAssets.push({
        id: 'text-1', type: 'text', title: 'Feature Analysis', content: textContent,
        createdAt: new Date(), status: 'completed'
      });

      // STEP 3: Pitch (Spec Sheet)
      setCurrentStep(3);
      setStatusMsg("Generating expert recommendation...");
      const pitchContent = await generatePitchScript(seed, insights.text);
      tempAssets.push({
        id: 'pitch-1', type: 'pitch', title: 'Assistant Recommendation', content: pitchContent,
        createdAt: new Date(), status: 'completed'
      });

      // STEP 4: Image
      setCurrentStep(4);
      setStatusMsg("Rendering device visualizer...");
      const imageUrl = await generateCampaignImage(seed);
      tempAssets.push({
        id: 'img-1', type: 'image', title: 'Device Visualization', content: imageUrl,
        createdAt: new Date(), status: 'completed'
      });

      // STEP 5: Audio
      setCurrentStep(5);
      setStatusMsg("Mastering audio setup guide...");
      const audioText = textContent.split('\n')[0].substring(0, 150) || "Initializing your smart gadget assistant.";
      const base64Audio = await generateCampaignAudio(audioText);
      tempAssets.push({
        id: 'audio-1', type: 'audio', title: 'Setup Guide Audio', content: base64Audio,
        createdAt: new Date(), status: 'completed'
      });

      // STEP 6: Video
      if (includeVideo) {
        setCurrentStep(6);
        try {
          const videoUrl = await generateCampaignVideo(seed, (msg) => setStatusMsg(msg));
          tempAssets.push({
            id: 'video-1', type: 'video', title: 'Product Showcase Video', content: videoUrl,
            createdAt: new Date(), status: 'completed'
          });
        } catch (vErr) {
          console.error("Video failed:", vErr);
          showToast("Video failed, continuing without showcase video.", "error");
        }
      }

      setAssets(tempAssets);

      const campaign: Campaign = {
        id: Date.now().toString(),
        name: seed.slice(0, 25) + (seed.length > 25 ? '...' : ''),
        seed,
        assets: tempAssets,
        createdAt: new Date()
      };
      saveCampaign(campaign);

      showToast("Gadget analysis completed and saved!", "success");
      setCurrentStep(steps.length + 1);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to finalize analysis. Check API quota.", "error");
    } finally {
      setIsGenerating(false);
      setStatusMsg("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass-morphism p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={120} />
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="text-indigo-400" /> Gadget Intelligence Studio
            </h2>
            <p className="text-slate-400 max-w-lg">Describe a gadget category or specific device. Our AI assistant will analyze specs, trends, and provide recommendations.</p>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">Visual Showcase (Veo)</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Paid Tier Required</p>
              </div>
              <div 
                onClick={() => setIncludeVideo(!includeVideo)}
                className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${includeVideo ? 'bg-indigo-600' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${includeVideo ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
        </div>
        
        <div className="relative group mb-4">
          <textarea
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Search for smart home hubs, wearables, or intelligent appliances..."
            className="w-full bg-slate-950/50 border border-slate-800 group-focus-within:border-indigo-500/50 rounded-2xl p-6 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 min-h-[140px] transition-all resize-none text-lg leading-relaxed shadow-inner"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !seed}
            className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-xl active:scale-95 group/btn"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                Start Analysis
                <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {isGenerating && (
          <div className="flex justify-center gap-8 py-4 border-t border-white/5 mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentStep >= step.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-600'}`}>
                   {currentStep > step.id ? <CheckCircle2 size={18} /> : <step.icon size={18} className={currentStep === step.id ? 'animate-pulse' : ''} />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= step.id ? 'text-indigo-400' : 'text-slate-600'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        )}

        {statusMsg && (
          <div className="mt-4 flex items-center gap-3 px-4 py-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
            <Loader2 size={14} className={`text-indigo-400 ${isGenerating ? 'animate-spin' : 'hidden'}`} />
            <p className={`text-xs font-medium ${isGenerating ? 'text-indigo-400' : 'text-emerald-400'}`}>{statusMsg}</p>
          </div>
        )}
      </div>

      {marketData && (
        <div className="glass-morphism rounded-3xl p-8 border border-white/5 shadow-lg animate-in fade-in duration-1000">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3 text-emerald-400">
               <div className="p-2 bg-emerald-500/10 rounded-lg"><Globe size={20} /></div>
               <h3 className="text-xl font-bold">Real-time Device Intelligence</h3>
             </div>
             <div className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 font-bold uppercase">Search Grounding</div>
           </div>
           <p className="text-slate-400 text-sm leading-relaxed mb-8 first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">{marketData.text}</p>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
             {marketData.sources.map((src, i) => (
               <a 
                key={i} 
                href={src.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 p-3 bg-slate-950/40 rounded-xl text-[10px] text-slate-400 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group"
               >
                 <Globe size={14} className="group-hover:text-indigo-400" /> 
                 <span className="truncate">{src.title || 'Source Reference'}</span>
               </a>
             ))}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assets.filter(a => a.id !== 'market-1').map((asset) => (
          <div key={asset.id} className="glass-morphism rounded-[2rem] overflow-hidden flex flex-col h-full border border-white/5 group shadow-xl">
            <div className="p-5 bg-slate-950/50 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3 text-slate-200">
                <div className={`p-2 rounded-lg ${
                  asset.type === 'text' ? 'bg-indigo-500/10 text-indigo-400' :
                  asset.type === 'image' ? 'bg-rose-500/10 text-rose-400' :
                  asset.type === 'video' ? 'bg-amber-500/10 text-amber-400' :
                  asset.type === 'pitch' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {asset.type === 'text' && <FileText size={18} />}
                  {asset.type === 'image' && <ImageIcon size={18} />}
                  {asset.type === 'video' && <Film size={18} />}
                  {asset.type === 'audio' && <Volume2 size={18} />}
                  {asset.type === 'pitch' && <Mic size={18} />}
                </div>
                <span className="font-bold tracking-tight">{asset.title}</span>
              </div>
              <button 
                onClick={() => handleDownload(asset)}
                className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
              >
                <Download size={18} />
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-auto max-h-[500px] custom-scrollbar">
              {(asset.type === 'text' || asset.type === 'pitch') && (
                <div className="prose prose-invert max-w-none text-sm text-slate-400 whitespace-pre-wrap font-medium leading-relaxed">
                  {asset.content}
                </div>
              )}
              {asset.type === 'image' && (
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img src={asset.content} alt="Visual" className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
              {asset.type === 'video' && (
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-slate-900 aspect-video">
                  <video src={asset.content} controls className="w-full h-full object-cover" />
                </div>
              )}
              {asset.type === 'audio' && (
                <div className="flex flex-col items-center justify-center py-16 space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-8 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
                    <div className="w-32 h-32 bg-indigo-600/10 rounded-full flex items-center justify-center border border-indigo-500/30 relative shadow-inner">
                      <Volume2 className="text-indigo-400" size={48} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-300 font-bold mb-1">AI Smart Guide - Narrative</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">24kHz PCM High Fidelity</p>
                  </div>
                  <button className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-full text-white font-black transition-all shadow-2xl shadow-indigo-600/40 transform active:scale-95">
                    <Play size={20} fill="currentColor" /> Preview Audio Guide
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studio;
