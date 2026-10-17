import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, X, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import api from '../../api';

export default function VoiceAgentWidget({ role = 'MEMBER', userId = 1 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('IDLE'); // IDLE, LISTENING, THINKING, SPEAKING
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setStatus('LISTENING');
        setError(null);
      };

      rec.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        transcriptRef.current = text;
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setStatus('IDLE');
        if (event.error !== 'no-speech') {
          setError('Microphone access issue. You can also click the quick prompt buttons below!');
        }
      };

      rec.onend = () => {
        const query = transcriptRef.current;
        if (query && query.trim()) {
          processVoiceQuery(query);
        } else {
          setStatus('IDLE');
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort errors
        }
      }
    };
  }, []);

  const startListening = () => {
    setTranscript('');
    transcriptRef.current = '';
    setResponse(null);
    setError(null);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition already started:', err);
      }
    } else {
      setError('Speech recognition not supported in this browser. Use Chrome or Edge.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setStatus('IDLE');
  };

  const speakText = (text) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setStatus('SPEAKING');
    utterance.onend = () => setStatus('IDLE');
    utterance.onerror = () => setStatus('IDLE');

    window.speechSynthesis.speak(utterance);
  };

  const processVoiceQuery = async (queryText) => {
    setStatus('THINKING');
    try {
      const res = await api.post('/ai/voice-agent/chat', {
        transcript: queryText,
        userId: userId,
        role: role,
      });

      const data = res.data;
      setResponse(data);

      if (data.spokenResponse) {
        speakText(data.spokenResponse);
      } else {
        setStatus('IDLE');
      }
    } catch (err) {
      console.error('Voice Agent API error:', err);
      setError('Connection failed. Please check backend API.');
      setStatus('IDLE');
    }
  };

  const handleQuickPrompt = (promptText) => {
    setTranscript(promptText);
    processVoiceQuery(promptText);
  };

  return (
    <>
      {/* Floating Launcher Trigger */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-300/40 cursor-pointer backdrop-blur-xl group"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
        </div>
        <span className="text-sm tracking-wide">AI Voice Agent</span>
      </motion.button>

      {/* Voice Agent Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[92vw] bg-slate-900/95 border border-emerald-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden flex flex-col text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    HealthPoint Voice AI
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Conversational Coach & Diet Engine</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Voice Orb Visualizer */}
            <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950/80 to-slate-900/40 relative">
              <div className="relative flex items-center justify-center w-36 h-36">
                {/* Soundwave animation rings */}
                {status === 'LISTENING' && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                      className="absolute inset-0 rounded-full border-2 border-emerald-400/60 bg-emerald-500/10"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="absolute inset-0 rounded-full border border-teal-400/40"
                    />
                  </>
                )}

                {status === 'SPEAKING' && (
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-teal-500/30 blur-md"
                  />
                )}

                {/* Central Orb Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={status === 'LISTENING' ? stopListening : startListening}
                  className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
                    status === 'LISTENING'
                      ? 'bg-gradient-to-tr from-rose-500 to-pink-600 shadow-rose-500/40 text-white'
                      : status === 'SPEAKING'
                      ? 'bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 shadow-cyan-500/40 text-slate-950'
                      : status === 'THINKING'
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white animate-pulse'
                      : 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/30 text-slate-950'
                  }`}
                >
                  {status === 'THINKING' ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : status === 'LISTENING' ? (
                    <MicOff className="w-8 h-8 animate-bounce" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                  <span className="text-[11px] font-bold tracking-wider uppercase mt-1">
                    {status === 'IDLE' ? 'Tap to Talk' : status}
                  </span>
                </motion.button>
              </div>

              {/* Status & Subtitle Display */}
              <div className="mt-5 text-center min-h-[48px] max-w-full px-4">
                {transcript && (
                  <p className="text-sm font-medium text-emerald-300 italic bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
                    "{transcript}"
                  </p>
                )}
                {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
              </div>
            </div>

            {/* Response Section */}
            {response && (
              <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/80 max-h-48 overflow-y-auto">
                {response.dietAltered && (
                  <div className="mb-3 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Diet Plan Automatically Altered & Saved to Dashboard!</span>
                  </div>
                )}
                <p className="text-sm text-slate-200 leading-relaxed">{response.spokenResponse}</p>

                {response.actionData && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {Object.entries(response.actionData).map(([key, val]) => (
                      <div key={key} className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-[10px] uppercase text-slate-400 font-bold">{key}</div>
                        <div className="text-xs font-extrabold text-emerald-400">{String(val)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Action Prompt Chips */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleQuickPrompt("Switch my diet to high protein vegan")}
                className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3 text-amber-400" /> Switch to Vegan Diet
              </button>
              <button
                onClick={() => handleQuickPrompt("Explain my current diet plan macros")}
                className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" /> Explain My Diet
              </button>
              <button
                onClick={() => handleQuickPrompt("How to take Creatine Monohydrate?")}
                className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition flex items-center gap-1.5"
              >
                <Bot className="w-3 h-3 text-emerald-400" /> Creatine Doubt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
