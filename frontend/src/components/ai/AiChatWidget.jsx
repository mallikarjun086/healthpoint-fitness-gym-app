import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAiChat, useWorkoutAdaptation, useApplyWorkoutAdaptation } from '../../hooks/useAi';
import WorkoutAdaptationModal from './WorkoutAdaptationModal';
import { toast } from 'sonner';

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your HealthPoint AI Coach. How can I assist your training or nutrition today?" }
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
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            className="fixed bottom-20 right-6 w-[360px] h-[540px] max-h-[75vh] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-surface-elevated p-3.5 border-b border-border flex justify-between items-center z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-text-primary font-semibold text-xs">AI Coach Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-text-secondary">Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-surface transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                      msg.role === 'user' ? 'bg-surface-elevated text-text-secondary' : 'bg-primary text-white'
                    }`}>
                      {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    </div>
                    <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white font-medium rounded-tr-none' 
                        : msg.role === 'system'
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-none'
                        : 'panel bg-surface border-border text-text-primary rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isPending && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%] flex-row items-center">
                    <div className="w-5 h-5 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="panel bg-surface px-3 py-2 rounded-xl rounded-tl-none flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 bg-surface-elevated border-t border-border">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your coach anything..."
                  className="w-full bg-surface border border-border text-text-primary text-xs rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-primary placeholder:text-text-muted"
                  disabled={isPending}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isPending}
                  className="absolute right-1.5 p-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-40"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-lg flex items-center justify-center z-50 transition-colors"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" />
        )}
      </button>

      <WorkoutAdaptationModal 
        isOpen={!!adaptationData} 
        onClose={() => setAdaptationData(null)} 
        adaptationData={adaptationData} 
        onAccept={(data) => {
          applyAdaptation(JSON.stringify(data), {
            onSuccess: () => {
              toast.success('Workout plan successfully updated');
            }
          });
        }} 
      />
    </>
  );
}
