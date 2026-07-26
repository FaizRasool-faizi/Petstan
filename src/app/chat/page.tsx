'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { FiSend, FiMessageSquare, FiUser, FiLoader } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUserId = searchParams?.get('userId') || null;
  
  const { user, isAuthenticated } = useAuthStore();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(initialUserId);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll intervals
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchConversations();
    const convoInterval = setInterval(fetchConversations, 10000);
    return () => clearInterval(convoInterval);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!activeUserId || !isAuthenticated) return;
    
    fetchMessages(activeUserId);
    const msgInterval = setInterval(() => fetchMessages(activeUserId, false), 3000);
    return () => clearInterval(msgInterval);
  }, [activeUserId, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/chat/conversations');
      setConversations(res.data);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (userId: string, showLoader = true) => {
    try {
      if (showLoader) setIsLoadingMessages(true);
      const res = await axios.get(`/api/chat?userId=${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUserId) return;

    const msgContent = newMessage;
    setNewMessage(''); // optimistic clear
    
    // Optimistic UI update
    setMessages(prev => [...prev, { 
       _id: Date.now().toString(), 
       senderId: user?.id, 
       receiverId: activeUserId, 
       content: msgContent,
       createdAt: new Date().toISOString()
    }]);

    try {
      await axios.post('/api/chat', {
        receiverId: activeUserId,
        content: msgContent
      });
      fetchConversations(); // Update last message
      // Messages will be fetched on next poll anyway
    } catch (error) {
      toast.error('Failed to send message');
      fetchMessages(activeUserId); // revert on failure
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
       router.push('/login?redirect=/chat');
    }
    return <div className="min-h-screen bg-neutral-100 flex items-center justify-center">Redirecting to login...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      <Toaster position="top-right" />

      <div className="flex-1 container-custom pt-28 pb-8 flex items-start justify-center">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden flex h-[700px]">
          
          {/* Sidebar */}
          <div className="w-1/3 border-r border-neutral-200 flex flex-col bg-neutral-50/50">
            <div className="p-6 border-b border-neutral-200 bg-white">
              <h2 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2">
                <FiMessageSquare className="text-primary-600" /> Messages
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="flex justify-center p-8"><FiLoader className="animate-spin text-primary-500 w-6 h-6" /></div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 font-medium text-sm">
                  No conversations yet.
                </div>
              ) : (
                conversations.map((convo) => {
                  const otherUser = convo.participants.find((p: any) => p._id !== user?.id);
                  const isActive = otherUser?._id === activeUserId;
                  
                  return (
                    <button
                      key={convo._id}
                      onClick={() => setActiveUserId(otherUser?._id)}
                      className={`w-full text-left p-4 flex items-center gap-4 transition-colors border-b border-neutral-100 ${
                        isActive ? 'bg-primary-50 border-l-4 border-l-primary-500' : 'hover:bg-white border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-neutral-200 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                         {otherUser?.avatar ? (
                            <img src={otherUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                         ) : (
                            <FiUser className="text-neutral-400" />
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-neutral-900 truncate">{otherUser?.name || 'Unknown User'}</h4>
                        <p className="text-xs text-neutral-500 truncate font-medium mt-0.5">{convo.lastMessage || 'Start a conversation...'}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white relative">
            {!activeUserId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
                <FiMessageSquare className="w-16 h-16 mb-4 text-neutral-200" />
                <p className="font-bold">Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-neutral-200 flex items-center gap-4 bg-white/80 backdrop-blur-md absolute top-0 w-full z-10">
                  <h3 className="font-extrabold text-neutral-900">Active Chat</h3>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 pt-24 space-y-4 bg-neutral-50/30">
                  {isLoadingMessages && messages.length === 0 ? (
                    <div className="flex justify-center"><FiLoader className="animate-spin text-primary-500 w-6 h-6" /></div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-neutral-400 font-medium text-sm mt-10">
                      Send a message to start the conversation!
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm font-medium shadow-sm ${
                            isMe 
                              ? 'bg-primary-600 text-white rounded-br-none' 
                              : 'bg-white border border-neutral-200 text-neutral-700 rounded-bl-none'
                          }`}>
                            {msg.content}
                            <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-200' : 'text-neutral-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t border-neutral-200">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-neutral-100 border-transparent focus:bg-white focus:border-primary-500 rounded-xl px-5 py-3 text-sm font-medium outline-none transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}


export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
