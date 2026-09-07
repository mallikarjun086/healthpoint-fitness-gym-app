import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  UserCheck, 
  CheckCheck,
  Phone,
  Video
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const defaultMessages = [
  {
    id: 1,
    senderId: 2,
    senderName: 'Master Trainer Alex',
    message: 'Hey! Reviewed your Push session logs from yesterday. Great progressive overload on the Incline DB Press (32kg x 8 reps).',
    timestamp: '2026-09-02T16:30:00',
    isRead: true
  },
  {
    id: 2,
    senderId: 3,
    senderName: 'Alex Rivers',
    message: 'Thanks Alex! Felt locked in on the scapular retraction cue. Should I bump the top set to 34kg next Monday?',
    timestamp: '2026-09-02T16:35:00',
    isRead: true
  },
  {
    id: 3,
    senderId: 2,
    senderName: 'Master Trainer Alex',
    message: 'Yes, aim for 34kg on set 1 for 6 reps. Keep 1 rep in reserve (RIR 1). Also hit your 185g protein target today.',
    timestamp: '2026-09-02T16:40:00',
    isRead: true
  }
];

const MemberChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(defaultMessages);
  const [newMessage, setNewMessage] = useState('');
  const [trainer, setTrainer] = useState({ id: 2, name: 'Master Trainer Alex', status: 'ONLINE', specialization: 'Hypertrophy & Biomechanics' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversation();
    const interval = setInterval(fetchConversation, 3000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const userId = user?.id || 3;
      const res = await api.get(`/chat/conversation?user1=${userId}&user2=2`);
      if (res.data && res.data.length > 0) {
        setMessages(res.data);
      }
    } catch (e) {
      console.log('Chat thread fallback');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const payload = {
      senderId: user?.id || 3,
      senderName: user?.name || 'Alex Rivers',
      receiverId: 2,
      receiverName: trainer.name,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, { ...payload, id: Date.now() }]);
    setNewMessage('');

    try {
      await api.post('/chat/send', payload);
    } catch (e) {
      console.log('Message sent locally');
    }
  };

  const quickPrompts = [
    'How is my deadlift bar path?',
    'Should I adjust caloric target today?',
    'Lower back feeling tight, any mobility drills?'
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 relative overflow-hidden flex flex-col h-screen">
        {/* Header */}
        <header className="mb-4 flex justify-between items-center pb-4 border-b border-border">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface absolute -bottom-0.5 -right-0.5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-primary">{trainer.name}</h2>
                <span className="badge-accent text-[10px]">Assigned Coach</span>
              </div>
              <p className="text-xs text-text-secondary">{trainer.specialization}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toast.info('Voice consultation available during booked PT sessions')}
              className="p-2 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary border border-border"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.info('Video form check available during booked PT sessions')}
              className="p-2 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary border border-border"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === (user?.id || 3);

            return (
              <div
                key={msg.id || idx}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md p-3.5 rounded-xl text-xs leading-relaxed ${
                  isMe 
                    ? 'bg-primary text-white font-medium rounded-tr-none' 
                    : 'panel bg-surface text-text-primary rounded-tl-none border-border'
                }`}>
                  <div className="font-semibold text-[10px] mb-0.5 opacity-75">
                    {msg.senderName}
                  </div>
                  <p>{msg.message}</p>
                  <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-white/70' : 'text-text-secondary'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setNewMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary text-[11px] font-medium shrink-0 border border-border transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message to your coach..."
            className="flex-1 bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:border-primary outline-none"
          />
          <button type="submit" className="btn-primary">
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default MemberChat;
