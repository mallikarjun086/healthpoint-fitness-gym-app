import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  UserCheck, 
  CheckCheck,
  Search,
  Dumbbell
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const defaultClientConversations = [
  {
    clientId: 3,
    clientName: 'Alex Rivers',
    lastMessage: 'Thanks Alex! Felt locked in on the scapular retraction cue.',
    time: '4:35 PM',
    unreadCount: 0,
    goal: 'Hypertrophy',
    messages: [
      { id: 1, senderId: 2, senderName: 'Master Trainer Alex', message: 'Hey! Reviewed your Push session logs from yesterday. Great progressive overload on the Incline DB Press (32kg x 8 reps).', timestamp: '2026-09-02T16:30:00' },
      { id: 2, senderId: 3, senderName: 'Alex Rivers', message: 'Thanks Alex! Felt locked in on the scapular retraction cue. Should I bump the top set to 34kg next Monday?', timestamp: '2026-09-02T16:35:00' },
      { id: 3, senderId: 2, senderName: 'Master Trainer Alex', message: 'Yes, aim for 34kg on set 1 for 6 reps. Keep 1 rep in reserve (RIR 1). Also hit your 185g protein target today.', timestamp: '2026-09-02T16:40:00' }
    ]
  },
  {
    clientId: 4,
    clientName: 'Sarah Jenkins',
    lastMessage: 'Loved the conditioning session today. Should I take creatine on rest days?',
    time: 'Yesterday',
    unreadCount: 1,
    goal: 'Fat Loss',
    messages: [
      { id: 10, senderId: 4, senderName: 'Sarah Jenkins', message: 'Loved the conditioning session today. Should I take creatine on rest days?', timestamp: '2026-09-01T18:20:00' }
    ]
  },
  {
    clientId: 5,
    clientName: 'Michael Vance',
    lastMessage: 'Ready for the 140kg squat attempt on Thursday.',
    time: '2 days ago',
    unreadCount: 0,
    goal: 'Strength',
    messages: [
      { id: 20, senderId: 5, senderName: 'Michael Vance', message: 'Ready for the 140kg squat attempt on Thursday.', timestamp: '2026-08-31T14:10:00' }
    ]
  }
];

const TrainerChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(defaultClientConversations);
  const [activeClient, setActiveClient] = useState(defaultClientConversations[0]);
  const [replyMessage, setReplyMessage] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeClient]);

  useEffect(() => {
    fetchActiveConversation();
    const interval = setInterval(fetchActiveConversation, 3000);
    return () => clearInterval(interval);
  }, [activeClient?.clientId]);

  const fetchActiveConversation = async () => {
    if (!activeClient?.clientId) return;
    try {
      const trainerId = user?.id || 2;
      const res = await api.get(`/chat/conversation?user1=${trainerId}&user2=${activeClient.clientId}`);
      if (res.data && res.data.length > 0) {
        setActiveClient(prev => ({
          ...prev,
          messages: res.data
        }));
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    const trainerId = user?.id || 2;
    const trainerName = user?.name || 'Master Trainer Alex';

    const newMsg = {
      id: Date.now(),
      senderId: trainerId,
      senderName: trainerName,
      receiverId: activeClient.clientId,
      receiverName: activeClient.clientName,
      message: replyMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = conversations.map(c => {
      if (c.clientId === activeClient.clientId) {
        return {
          ...c,
          lastMessage: replyMessage.trim(),
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    setConversations(updated);
    setActiveClient(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
    setReplyMessage('');

    try {
      await api.post('/chat/send', newMsg);
    } catch (err) {
      console.log('Saved message locally');
    }
  };

  const filteredClients = conversations.filter(c =>
    c.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="trainer" />

      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8 relative overflow-hidden flex flex-col h-screen">
        <header className="mb-4 flex justify-between items-center pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-accent">Coaching Feed</span>
            </div>
            <h1 className="heading-xl text-text-primary">Client Messaging Center</h1>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-5 overflow-hidden">
          {/* Client Roster List */}
          <div className="col-span-12 md:col-span-4 panel-card p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search client roster..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl pl-8 pr-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
                {filteredClients.map(client => (
                  <div
                    key={client.clientId}
                    onClick={() => setActiveClient(client)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      activeClient.clientId === client.clientId
                        ? 'bg-primary/10 border-primary text-text-primary shadow-sm'
                        : 'bg-surface-elevated border-border hover:border-border-light text-text-secondary'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-semibold text-xs text-text-primary">{client.clientName}</h4>
                      <span className="text-[10px] text-text-muted">{client.time}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary truncate">{client.lastMessage}</p>
                    <div className="text-[10px] text-primary font-medium mt-1">{client.goal}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Chat Conversation */}
          <div className="col-span-12 md:col-span-8 panel-card p-5 flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="pb-3 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="heading-md text-text-primary flex items-center gap-2">
                  {activeClient.clientName}
                  <span className="badge-accent text-[10px]">{activeClient.goal}</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-medium">Assigned Member</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
              {activeClient.messages.map((msg, idx) => {
                const isTrainer = msg.senderId === 2;

                return (
                  <div key={msg.id || idx} className={`flex ${isTrainer ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3.5 rounded-xl text-xs leading-relaxed ${
                      isTrainer
                        ? 'bg-primary text-white font-medium rounded-tr-none shadow-sm'
                        : 'bg-surface-elevated border border-border text-text-primary rounded-tl-none'
                    }`}>
                      <div className="font-medium text-[10px] mb-0.5 opacity-80">{msg.senderName}</div>
                      <p>{msg.message}</p>
                      <div className={`text-[9px] mt-1 text-right ${isTrainer ? 'text-white/70' : 'text-text-muted'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-border">
              <input
                type="text"
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder={`Message ${activeClient.clientName}...`}
                className="flex-1 bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:border-primary outline-none"
              />
              <button type="submit" className="btn-primary">
                <Send className="w-4 h-4" /> Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerChat;
