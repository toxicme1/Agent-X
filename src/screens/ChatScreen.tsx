import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from "react-native";
import { useChatStore } from "@/store/chatStore";
import { runAgentTurn } from "@/agent/core";
import { loadConfig } from "@/config/settings";
import { AgentStatusBar } from "@/ui/AgentStatusBar";
import { agentStatus } from "@/agent/status";

export function ChatScreen({ navigation }: any) {
  const { messages, add, setStatus } = useChatStore();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  React.useEffect(() => {
    const unsub = agentStatus.on(setStatus);
    return unsub;
  }, []);

  const send = async () => {
    if (!input.trim() || pending) return;
    const userMsg = { id: Date.now().toString(), role: "user" as const, content: input };
    add(userMsg);
    setInput("");
    setPending(true);
    try {
      const cfg = await loadConfig();
      const history = [
        { role: "system", content: "You are Android Agent. Be helpful. Use tools when needed. Ask before destructive actions via approval flow." },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: userMsg.content },
      ];
      const res = await runAgentTurn(history as any, cfg, (e) => {
        if (e.type === "tool_call") add({ id: Date.now().toString()+Math.random(), role: "tool", content: `Call ${e.tool}(${e.args})`, tool: e.tool });
        if (e.type === "tool_result") add({ id: Date.now().toString()+Math.random(), role: "tool", content: `Result: ${JSON.stringify(e.result)}`, tool: e.tool });
        if (e.type === "tool_error") add({ id: Date.now().toString()+Math.random(), role: "tool", content: `Error: ${e.error}`, tool: e.tool });
      });
      const last = res[res.length - 1];
      if (last?.role === "assistant" && last.content) {
        add({ id: Date.now().toString(), role: "assistant", content: last.content });
      }
    } catch (e: any) {
      add({ id: Date.now().toString(), role: "assistant", content: "Error: " + e.message });
      agentStatus.set("error");
      setTimeout(() => agentStatus.set("idle"), 1500);
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}><Text>Settings</Text></TouchableOpacity>
      </View>
      <AgentStatusBar />
      <FlatList
        data={messages}
        keyExtractor={m => m.id}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.role === "user" ? styles.user : item.role === "tool" ? styles.tool : styles.assistant]}>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Ask agent..." />
        <TouchableOpacity style={styles.btn} onPress={send} disabled={pending}><Text style={{color:"#fff"}}>{pending?"...":"Send"}</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 10, alignItems: "flex-end" },
  msg: { marginVertical: 6, padding: 10, borderRadius: 8, maxWidth: "90%" },
  user: { alignSelf: "flex-end", backgroundColor: "#e8f0ff" },
  assistant: { alignSelf: "flex-start", backgroundColor: "#f1f1f1" },
  tool: { alignSelf: "flex-start", backgroundColor: "#fff7e6" },
  role: { fontSize: 10, color: "#666", marginBottom: 4 },
  content: { fontSize: 14 },
  inputRow: { flexDirection: "row", padding: 8, borderTopWidth: 1, borderTopColor: "#eee" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8, marginRight: 8 },
  btn: { backgroundColor: "#2563eb", paddingHorizontal: 16, justifyContent: "center", borderRadius: 8 },
});
