import { registry } from "./registry";
import { agentStatus } from "./status";
import { chatCompletion } from "@/lib/http";
import { AgentConfig } from "@/config/settings";
import { MAX_TOOL_CALLS_PER_TURN } from "./safety";
import "@/agent/tools/index";

export async function runAgentTurn(messages: any[], cfg: AgentConfig, onEvent: (e: any) => void) {
  agentStatus.set("thinking");
  const tools = registry.schema();
  let history = [...messages];
  let calls = 0;

  while (calls < MAX_TOOL_CALLS_PER_TURN) {
    const body: any = {
      model: cfg.model,
      messages: history,
      temperature: cfg.temperature ?? 0.7,
      tools: tools.length ? tools : undefined,
      tool_choice: tools.length ? "auto" : undefined,
      stream: false,
    };

    const res = await chatCompletion(cfg, body);
    const msg = res?.choices?.[0]?.message;
    if (!msg) throw new Error("Invalid response");

    if (msg.tool_calls && msg.tool_calls.length) {
      calls++;
      history.push(msg);
      for (const tc of msg.tool_calls) {
        const fn = tc.function?.name;
        const tool = registry.get(fn);
        if (!tool) {
          history.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify({ error: "unknown tool" }) });
          continue;
        }
        onEvent({ type: "tool_call", tool: fn, args: tc.function?.arguments });
        agentStatus.set(fn === "run_shell" ? "running_command" : fn === "dial" || fn === "sms" ? "calling_phone" : "using_tool");
        try {
          const args = typeof tc.function?.arguments === "string" ? JSON.parse(tc.function.arguments) : tc.function?.arguments || {};
          const result = await tool.execute(args, { approved: true });
          history.push({ role: "tool", tool_call_id: tc.id, content: typeof result === "string" ? result : JSON.stringify(result) });
          onEvent({ type: "tool_result", tool: fn, result });
        } catch (e: any) {
          history.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify({ error: e.message }) });
          onEvent({ type: "tool_error", tool: fn, error: e.message });
        }
      }
      continue;
    }

    if (msg.content) {
      history.push(msg);
      agentStatus.set("idle");
      onEvent({ type: "message", message: msg });
      return history;
    }
    break;
  }
  agentStatus.set("idle");
  return history;
}
