import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAiChat, useWorkoutAdaptation, useApplyWorkoutAdaptation } from '../../hooks/useAi';
import WorkoutAdaptationModal from './WorkoutAdaptationModal';
import { toast } from 'sonner';

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your HealthPoint AI Coach. How can I help you crush your goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [adaptationData, setAdaptationData] = useState(null);
  const messagesEndRef = useRef(null);
  
  const { mutate: sendMessage, isPending } = useAiChat();
  const { mutate: applyAdaptation } = useApplyWorkoutAdaptation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isPending, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    sendMessage({ message: userMessage }, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: "Sorry, I'm having trouble connecting to the server. Please try again." 
        }]);
      }
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] h-[600px] max-h-[80vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Coach</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                    <span className="text-xs text-neutral-400">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors bg-neutral-800/50 p-1.5 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      msg.role === 'user' ? 'bg-neutral-800' : 'bg-gradient-to-tr from-emerald-400 to-cyan-500'
                    }`}>
                      {msg.role === 'user' ? <User className="w-3 h-3 text-neutral-400" /> : <Bot className="w-3 h-3 text-black" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-neutral-800 text-white rounded-tr-none' 
                        : msg.role === 'system'
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-none'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isPending && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-black" />
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-neutral-950 border-t border-neutral-800">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your coach anything..."
                  className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-neutral-500"
                  disabled={isPending}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isPending}
                  className="absolute right-2 p-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center z-50 group border border-emerald-300/30"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <MessageSquare className="w-6 h-6 text-black group-hover:rotate-12 transition-transform" />
        )}
      </motion.button>

      <WorkoutAdaptationModal 
        isOpen={!!adaptationData} 
        onClose={() => setAdaptationData(null)} 
        adaptationData={adaptationData} 
        onAccept={(data) => {
          applyAdaptation(JSON.stringify(data), {
            onSuccess: () => {
              toast.success('Workout plan successfully updated!');
            }
          });
        }} 
      />
    </>
  );
}
