import { registry } from "../registry";
import { Linking, NativeModules } from "react-native";
import { agentStatus } from "../status";

registry.register({
  name: "open_url",
  description: "Open a URL in browser or app",
  risk: "low",
  parameters: { type: "object", properties: { url: { type: "string" } }, required: ["url"] },
  execute: async ({ url }) => {
    agentStatus.set("browsing");
    await Linking.openURL(url);
    return { ok: true };
  }
});

registry.register({
  name: "dial",
  description: "Dial a phone number",
  risk: "high",
  parameters: { type: "object", properties: { number: { type: "string" } }, required: ["number"] },
  execute: async ({ number }) => {
    agentStatus.set("calling_phone");
    await Linking.openURL(`tel:${number}`);
    return { ok: true };
  }
});

registry.register({
  name: "sms",
  description: "Send SMS to a number",
  risk: "high",
  parameters: { type: "object", properties: { number: { type: "string" }, message: { type: "string" } }, required: ["number", "message"] },
  execute: async ({ number, message }) => {
    agentStatus.set("calling_phone");
    await Linking.openURL(`sms:${number}?body=${encodeURIComponent(message)}`);
    return { ok: true };
  }
});

registry.register({
  name: "run_shell",
  description: "Run a shell command on device (requires approval)",
  risk: "high",
  parameters: { type: "object", properties: { command: { type: "string" } }, required: ["command"] },
  execute: async ({ command }, ctx: any) => {
    agentStatus.set("running_command");
    const mod = NativeModules.DeviceToolsModule;
    if (!mod?.runShell) throw new Error("DeviceToolsModule not available");
    return await mod.runShell(command, !!ctx.approved);
  }
});

registry.register({
  name: "device_info",
  description: "Get device info",
  risk: "low",
  parameters: { type: "object", properties: {} },
  execute: async () => {
    const mod = NativeModules.DeviceToolsModule;
    if (mod?.getDeviceInfo) return await mod.getDeviceInfo();
    return { note: "native module missing" };
  }
});
