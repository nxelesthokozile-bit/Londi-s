
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Headphones, BrainCircuit, Loader2, Circle, Volume2, Zap } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decodePCM, encodePCM, decodeAudioData } from '../services/geminiService';

const LiveCoach: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const toggleSession = async () => {
    if (isActive) {
      sessionRef.current?.close();
      setIsActive(false);
      setStatus('idle');
      return;
    }

    try {
      setStatus('connecting');
      // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Live Session Connected');
            setIsActive(true);
            setStatus('listening');

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              // Fix: Corrected variable reference from undefined 'data' to 'inputData'
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob = {
                data: encodePCM(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              // Use sessionPromise.then to ensure data is sent only after the session is resolved.
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => [...prev, `AI: ${text}`]);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setStatus('speaking');
              const bytes = decodePCM(audioData);
              const buffer = await decodeAudioData(bytes, outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              
              // Maintain nextStartTime for gapless playback of PCM chunks.
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const s of sourcesRef.current.values()) {
                s.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error("Live API Error:", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            // Explicit voice selection as per Gemini Live API guidelines.
            voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Zephyr'}},
          },
          outputAudioTranscription: {},
          systemInstruction: 'You are an elite marketing strategist. Brainstorm creative campaign angles with the user in real-time. Be concise and encouraging.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Strategy Brainstorm</h2>
          <p className="text-slate-400">Speak naturally with Gemini to refine your campaign strategy.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${isActive ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            <Circle size={8} fill="currentColor" className={isActive ? 'animate-pulse' : ''} />
            <span className="text-sm font-medium uppercase tracking-wider">{status}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 glass-morphism rounded-3xl p-8 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-4 custom-scrollbar">
          {transcription.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <BrainCircuit size={64} className="mb-4 text-indigo-400" />
              <p className="text-xl font-medium">Your strategy session starts here.</p>
              <p className="max-w-xs mt-2">Activate the microphone to brainstorm ideas, naming, or distribution tactics.</p>
            </div>
          )}
          {transcription.map((line, i) => (
            <div key={i} className={`p-4 rounded-2xl ${line.startsWith('AI:') ? 'bg-indigo-600/10 border border-indigo-500/20 mr-12' : 'bg-slate-800/50 ml-12 text-right'}`}>
              <p className="text-slate-200">{line.replace('AI: ', '')}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-8 py-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-slate-500">
            <Headphones size={20} />
            <span className="text-sm">Audio Out</span>
          </div>
          
          <button
            onClick={toggleSession}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl ${
              isActive 
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30' 
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {status === 'connecting' ? (
              <Loader2 className="animate-spin text-white" size={32} />
            ) : isActive ? (
              <MicOff className="text-white" size={32} />
            ) : (
              <Mic className="text-white" size={32} />
            )}
          </button>

          <div className="flex items-center gap-2 text-slate-500">
            <Mic size={20} />
            <span className="text-sm">Audio In</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-morphism p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><BrainCircuit size={20} /></div>
          <p className="text-xs text-slate-400">Low-latency Reasoning</p>
        </div>
        <div className="glass-morphism p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Volume2 size={20} /></div>
          <p className="text-xs text-slate-400">Natural Voice Feedback</p>
        </div>
        <div className="glass-morphism p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Zap size={20} /></div>
          <p className="text-xs text-slate-400">Real-time Context Aware</p>
        </div>
      </div>
    </div>
  );
};

export default LiveCoach;
