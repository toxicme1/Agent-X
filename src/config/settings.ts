import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AgentConfig {
  provider: "omniroute" | "openrouter" | "ollama" | "generic";
  baseUrl: string;
  apiKey?: string;
  model: string;
  temperature?: number;
  stream?: boolean;
}

const KEY = "agent_config_v1";

export const DEFAULT_CONFIG: AgentConfig = {
  provider: "omniroute",
  baseUrl: "https://api.omniroute.ai/v1",
  model: "gpt-4o-mini",
  temperature: 0.7,
  stream: true,
};

export async function loadConfig(): Promise<AgentConfig> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(cfg: AgentConfig) {
  await AsyncStorage.setItem(KEY, JSON.stringify(cfg));
}
