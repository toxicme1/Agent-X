import React from "react";
import LottieView from "lottie-react-native";
import { View, Text, StyleSheet } from "react-native";
import { AgentStatus } from "@/agent/status";

const anims: Record<AgentStatus, any> = {
  idle: require("@/assets/animations/idle.json"),
  thinking: require("@/assets/animations/thinking.json"),
  running_command: require("@/assets/animations/running_command.json"),
  using_tool: require("@/assets/animations/using_tool.json"),
  calling_phone: require("@/assets/animations/calling_phone.json"),
  browsing: require("@/assets/animations/browsing.json"),
  success: require("@/assets/animations/success.json"),
  error: require("@/assets/animations/error.json"),
};

const labels: Record<AgentStatus, string> = {
  idle: "Idle",
  thinking: "Thinking...",
  running_command: "Running command...",
  using_tool: "Using tool...",
  calling_phone: "Handling call/SMS...",
  browsing: "Browsing...",
  success: "Done",
  error: "Error",
};

export function AnimatedAgent({ status, size = 80 }: { status: AgentStatus; size?: number }) {
  const src = anims[status] || anims.idle;
  return (
    <View style={styles.wrap}>
      <LottieView source={src} autoPlay loop={status !== "success" && status !== "error"} style={{ width: size, height: size }} />
      {status !== "idle" && <Text style={styles.label}>{labels[status]}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  label: { marginTop: 4, fontSize: 12, color: "#666" },
});
