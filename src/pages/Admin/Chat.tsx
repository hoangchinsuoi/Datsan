import React, { useEffect, useState } from "react";
import { Send, User, MessageCircle, Clock } from "lucide-react";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { 
  fetchAdminConversations, 
  fetchChatHistory, 
  replyAsAdmin, 
  type AdminConversation, 
  type ChatHistoryRow 
} from "../../services/chatService";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const AdminChat: React.FC = () => {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatHistoryRow[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadHistory(selectedId);
      const interval = setInterval(() => loadHistory(selectedId), 3000); // Poll history every 3s
      return () => clearInterval(interval);
    }
  }, [selectedId]);

  const loadConversations = async () => {
    try {
      const data = await fetchAdminConversations();
      setConversations(data);
    } catch (e) {
      console.error("Failed to load conversations", e);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (id: string) => {
    try {
      const history = await fetchChatHistory(id, "ADMIN_SESSION"); // clientSessionId doesn't matter for admin with right token
      setMessages(history);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !input.trim() || sending) return;

    setSending(true);
    try {
      await replyAsAdmin(selectedId, input);
      setInput("");
      await loadHistory(selectedId);
    } catch (e) {
      alert("Không thể gửi tin nhắn.");
    } finally {
      setSending(false);
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedId);

  return (
    <div className="flex min-h-screen bg-surface-container-lowest">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-screen ml-72">
        <header className="h-20 bg-white border-b border-outline-variant/10 flex items-center justify-between px-10">
          <h1 className="text-2xl font-black font-headline tracking-tight">Chat Management</h1>
          <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Real-time Support Active
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversation List */}
          <div className="w-96 border-r border-outline-variant/10 bg-white flex flex-col">
            <div className="p-6 border-b border-outline-variant/5">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/5">
              {loading ? (
                <div className="p-10 text-center text-sm text-on-surface-variant">Loading chats...</div>
              ) : conversations.length === 0 ? (
                <div className="p-10 text-center text-sm text-on-surface-variant">No active conversations.</div>
              ) : conversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full p-5 text-left hover:bg-surface-container-low transition-all flex gap-4 relative group ${selectedId === c.id ? 'bg-primary/5' : ''}`}
                >
                  {selectedId === c.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="font-black text-sm text-on-surface truncate">{c.userName}</p>
                      <span className="text-[10px] font-bold text-on-surface-variant whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: vi })}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate font-medium">{c.lastMessage || "No messages yet"}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-surface-container-lowest">
            {selectedId ? (
              <>
                <div className="p-6 border-b border-outline-variant/10 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-black">{selectedConv?.userName}</p>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Conversation ID: {selectedId.slice(0,8)}...</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] space-y-1 ${m.role === 'user' ? 'items-start' : 'items-end'}`}>
                        <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                          m.role === 'user' 
                            ? 'bg-white stadium-shadow text-on-surface rounded-tl-none border border-outline-variant/10' 
                            : 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20'
                        }`}>
                          {m.content}
                        </div>
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-tighter px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-white border-t border-outline-variant/10">
                  <form onSubmit={handleSend} className="flex gap-4">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || sending}
                      className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-40">
                <div className="w-24 h-24 rounded-[2rem] bg-surface-container-high flex items-center justify-center mb-6">
                  <MessageCircle className="w-12 h-12 text-on-surface-variant" />
                </div>
                <h3 className="text-xl font-black font-headline mb-2">Select a Conversation</h3>
                <p className="text-sm max-w-xs">Choose a chat from the left to start communicating with your customers.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminChat;
