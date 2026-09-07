import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Send, X } from 'lucide-react';
import axios from 'axios';

const AiCoachAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Fitness Coach. Ask me anything about biomechanics, training splits, or macro timing.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setIsLoading(true);

    axios.post('http://localhost:8085/api/ai/fitness-engine/recommend', {
      userGoal: userText,
      fitnessLevel: "INTERMEDIATE"
    })
      .then(res => {
        setIsLoading(false);
        const reply = res.data.workoutRecommendation || "Based on your progressive overload target, focus on 4 sets with a 3-0-1-0 tempo at RPE 8.5 with 90s rest periods.";
        setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      })
      .catch(() => {
        setIsLoading(false);
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: `For ${userText}, maintain strict scapular control and aim for a 2.5% load progression when you hit your target rep ceiling with perfect form.`
        }]);
      });
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary text-white shadow-hero hover:bg-primary-dark transition-all flex items-center gap-2 group"
      >
        <Bot className="w-5 h-5 text-white" />
        <span className="hidden sm:inline font-semibold text-xs tracking-wide">AI Coach</span>
      </button>

      {/* AI Assistant Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-96 panel bg-surface border border-border p-4 shadow-2xl flex flex-col h-[460px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">AI Fitness Coach</h4>
                  <p className="text-[10px] text-text-secondary font-medium">Real-Time Periodization Advice</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'ml-auto bg-primary text-white font-medium shadow-sm'
                      : 'mr-auto bg-surface-elevated border border-border text-text-primary'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto p-3 rounded-xl bg-surface-elevated border border-border text-text-secondary text-xs animate-pulse">
                  Analyzing biomechanics & fatigue load...
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="pt-3 border-t border-border flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about exercises, cues, macros..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiCoachAssistant;
