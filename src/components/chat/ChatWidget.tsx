import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, X } from "lucide-react";
import {
  askAiChat,
  clearStoredConversationId,
  ensureChatClientSessionId,
  fetchChatHistory,
  getStoredConversationId,
  setStoredConversationId,
} from "../../services/chatService";

type Sender = "user" | "bot";

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
}

const QUICK_QUESTIONS = [
  "Làm sao để đặt sân?",
  "Có thể xem lịch sử đặt sân ở đâu?",
  "Làm sao để hủy booking?",
];

const BOT_WELCOME =
  "Xin chào! Mình là trợ lý của The Pitch Editorial. Bạn cần hỗ trợ đặt sân, tài khoản hay lịch sử booking?";

function createMessage(sender: Sender, text: string): ChatMessage {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sender,
    text,
  };
}

export const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(() => getStoredConversationId());
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("bot", BOT_WELCOME),
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const stored = getStoredConversationId();
    setConversationId(stored);
    if (!stored) {
      setMessages([createMessage("bot", BOT_WELCOME)]);
      return;
    }

    setMessages([createMessage("bot", "Đang tải hội thoại...")]);

    let cancelled = false;
    void (async () => {
      try {
        const client = ensureChatClientSessionId();
        const rows = await fetchChatHistory(stored, client);
        if (cancelled) {
          return;
        }
        const mapped = rows.map((row) =>
          createMessage(row.role === "user" ? "user" : "bot", row.content)
        );
        setMessages([createMessage("bot", BOT_WELCOME), ...mapped]);
      } catch {
        if (!cancelled) {
          clearStoredConversationId();
          setConversationId(null);
          setMessages([createMessage("bot", BOT_WELCOME)]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const handleSend = async (value: string) => {
    const content = value.trim();
    if (!content) {
      return;
    }

    const userMessage = createMessage("user", content);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const client = ensureChatClientSessionId();
      const result = await askAiChat(content, {
        conversationId: conversationId ?? undefined,
        clientSessionId: client,
      });
      setStoredConversationId(result.conversationId);
      setConversationId(result.conversationId);
      setMessages((prev) => [...prev, createMessage("bot", result.reply)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage(
          "bot",
          "Hiện chưa thể kết nối AI. Bạn kiểm tra lại backend hoặc cấu hình API key rồi thử lại nhé."
        ),
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-[min(92vw,360px)] h-[520px] bg-white border border-outline-variant rounded-2xl stadium-shadow flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <div>
              <p className="font-headline font-bold text-sm">Hỗ trợ nhanh</p>
              <p className="text-[11px] opacity-90">The Pitch Editorial Assistant</p>
            </div>
            <button
              type="button"
              aria-label="Đóng chat"
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 bg-surface p-3 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "bg-secondary text-white rounded-br-md"
                      : "bg-surface-container-low text-on-surface rounded-bl-md"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-bl-md text-sm leading-relaxed bg-surface-container-low text-on-surface">
                  Đang trả lời...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-3 pb-2 pt-1 bg-white border-t border-outline-variant">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  disabled={isSending}
                  className="shrink-0 px-3 py-1.5 text-xs rounded-full bg-surface-container-low hover:bg-primary/10 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>

            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleSend(input);
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Nhập câu hỏi..."
                disabled={isSending}
                className="flex-1 border border-outline-variant rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="w-10 h-10 rounded-xl bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 text-[11px] text-on-surface-variant">
              <span>Cần thao tác nhanh?</span>
              <div className="flex items-center gap-2">
                <Link to="/search" className="hover:text-primary">
                  Search
                </Link>
                <Link to="/bookings" className="hover:text-primary">
                  Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-white stadium-shadow flex items-center justify-center hover:bg-primary-container transition-colors"
          aria-label="Mở chat hỗ trợ"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
