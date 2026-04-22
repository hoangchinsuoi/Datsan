import { apiGet, apiPost } from "./api";

const CLIENT_SESSION_KEY = "datsan_chat_client_session";
const CONVERSATION_KEY = "datsan_chat_conversation_id";

function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function ensureChatClientSessionId(): string {
  let id = readLocal(CLIENT_SESSION_KEY);
  if (!id) {
    id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    writeLocal(CLIENT_SESSION_KEY, id);
  }
  return id;
}

export function getStoredConversationId(): string | null {
  return readLocal(CONVERSATION_KEY);
}

export function setStoredConversationId(id: string) {
  writeLocal(CONVERSATION_KEY, id);
}

export function clearStoredConversationId() {
  try {
    localStorage.removeItem(CONVERSATION_KEY);
  } catch {
    /* ignore */
  }
}

type AskChatRequest = {
  message: string;
  clientSessionId: string;
  conversationId?: string;
};

export type AskChatResult = {
  reply: string;
  conversationId: string;
};

export async function askAiChat(
  message: string,
  options?: { conversationId?: string | null; clientSessionId?: string | null }
): Promise<AskChatResult> {
  const clientSessionId = options?.clientSessionId ?? ensureChatClientSessionId();
  const payload: AskChatRequest = {
    message,
    clientSessionId,
    ...(options?.conversationId ? { conversationId: options.conversationId } : {}),
  };
  return apiPost<AskChatResult>("/chat/ask", payload);
}

export type ChatHistoryRow = {
  role: string;
  content: string;
  createdAt: string;
};

type ChatHistoryResponse = {
  messages: ChatHistoryRow[];
};

export async function fetchChatHistory(conversationId: string, clientSessionId: string): Promise<ChatHistoryRow[]> {
  const data = await apiGet<ChatHistoryResponse>("/chat/history", {
    params: { conversationId, clientSessionId },
  });
  return data.messages;
}
