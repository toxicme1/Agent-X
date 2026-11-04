import React from "react";
import { View, StyleSheet } from "react-native";
import { AnimatedAgent } from "./AnimatedAgent";
import { useChatStore } from "@/store/chatStore";

export function AgentStatusBar() {
  const status = useChatStore(s => s.status);
  if (status === "idle") return null;
  return (
    <View style={styles.bar}>
      <AnimatedAgent status={status} size={60} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingVertical: 8, alignItems: "center", backgroundColor: "#f7f7f7" },
});
