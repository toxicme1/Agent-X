import axios from "axios";
import { AgentConfig } from "@/config/settings";

export function getHeaders(cfg: AgentConfig) {
  const headers: any = { "Content-Type": "application/json" };
  if (cfg.apiKey) headers["Authorization"] = `Bearer ${cfg.apiKey}`;
  if (cfg.provider === "openrouter") {
    headers["HTTP-Referer"] = "https://github.com/android-agent";
    headers["X-Title"] = "Android Agent";
  }
  return headers;
}

export async function chatCompletion(cfg: AgentConfig, body: any) {
  const url = cfg.baseUrl.replace(/\/$/, "") + "/chat/completions";
  const res = await axios.post(url, body, { headers: getHeaders(cfg), timeout: 120000 });
  return res.data;
}
