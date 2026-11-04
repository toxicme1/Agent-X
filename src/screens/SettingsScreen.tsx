import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { loadConfig, saveConfig, DEFAULT_CONFIG, AgentConfig } from "@/config/settings";

export function SettingsScreen() {
  const [cfg, setCfg] = useState<AgentConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    loadConfig().then(setCfg);
  }, []);

  const save = async () => {
    await saveConfig(cfg);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Provider</Text>
      <TextInput style={styles.input} value={cfg.provider} onChangeText={(v:any)=>setCfg({...cfg, provider:v})} placeholder="omniroute/openrouter/ollama/generic" />
      <Text style={styles.label}>Base URL</Text>
      <TextInput style={styles.input} value={cfg.baseUrl} onChangeText={(v)=>setCfg({...cfg, baseUrl:v})} placeholder="https://..." />
      <Text style={styles.label}>Model</Text>
      <TextInput style={styles.input} value={cfg.model} onChangeText={(v)=>setCfg({...cfg, model:v})} placeholder="gpt-4o-mini" />
      <Text style={styles.label}>API Key (optional)</Text>
      <TextInput style={styles.input} value={cfg.apiKey || ""} onChangeText={(v)=>setCfg({...cfg, apiKey:v})} placeholder="sk-..." secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={save}><Text style={{color:"#fff"}}>Save</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: "600", marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginTop: 6 },
  btn: { backgroundColor: "#2563eb", padding: 12, alignItems: "center", borderRadius: 8, marginTop: 20 },
});
