import { create } from "zustand";
import { AgentStatus } from "@/agent/status";

export interface Msg {
  id: string;
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  tool?: string;
  args?: any;
  result?: any;
}

interface ChatState {
  messages: Msg[];
  status: AgentStatus;
  add: (m: Msg) => void;
  setStatus: (s: AgentStatus) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  status: "idle",
  add: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setStatus: (s) => set({ status: s }),
  clear: () => set({ messages: [], status: "idle" }),
}));
