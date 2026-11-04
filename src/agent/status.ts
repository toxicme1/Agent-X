export type AgentStatus = "idle" | "thinking" | "running_command" | "using_tool" | "calling_phone" | "browsing" | "success" | "error";

class Emitter {
  private listeners = new Set<(s: AgentStatus) => void>();
  set(s: AgentStatus) { this.listeners.forEach(l => l(s)); }
  on(fn: (s: AgentStatus) => void) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
}

export const agentStatus = new Emitter();
