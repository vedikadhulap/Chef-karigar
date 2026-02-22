import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, sendChatMessage, fetchChatHistory } from '../services/api';
import toast from 'react-hot-toast';

interface ChatHubProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: 'business' | 'staff' | 'agency' | 'sales';
  visible?: boolean;
}

export const ChatHub: React.FC<ChatHubProps> = ({ 
  currentUserId, 
  currentUserName, 
  currentUserRole,
  visible = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock recipient - in production, this would be dynamic
  const recipientId = 'agency_support';
  const recipientName = 'Agency Support';

  useEffect(() => {
    if (visible) {
      setIsOpen(true);
      toast.success('Chat available! You can now message the agency.', { icon: '💬' });
    }
  }, [visible]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      const history = await fetchChatHistory(currentUserId, recipientId);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      receiverId: recipientId,
      message: newMessage.trim(),
      read: false
    };

    try {
      const sentMessage = await sendChatMessage(messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Simulate response after 2 seconds
      setTimeout(async () => {
        const response = await sendChatMessage({
          senderId: recipientId,
          senderName: recipientName,
          senderRole: 'agency',
          receiverId: currentUserId,
          message: 'Thanks for your message! Our team will respond shortly.',
          read: false
        });
        setMessages(prev => [...prev, response]);
      }, 2000);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!visible && !isOpen) return null;

  return (
    <>
      {/* Floating Chat Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            <MessageCircle size={28} />
            <motion.span
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              1
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '500px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-indigo-600 dark:bg-indigo-700 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm uppercase tracking-tight">{recipientName}</h3>
                  <p className="text-indigo-200 text-xs">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600 text-sm">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.senderId === currentUserId
                              ? 'bg-indigo-600 text-white rounded-br-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm font-medium">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.senderId === currentUserId ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-600'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-2 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 outline-none text-slate-900 dark:text-slate-100"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!newMessage.trim()}
                      className="bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
