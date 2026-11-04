export const DANGEROUS_CMDS = ["rm -rf", "mkfs", "dd if=", "shred", "su", "chmod 777", "curl | sh", "wget | sh", ":(){ :|:& };:"];
export const MAX_TOOL_CALLS_PER_TURN = 6;
export const MAX_HISTORY = 40;
export const SHELL_TIMEOUT_MS = 15000;

export function isDangerous(cmd: string) {
  const c = cmd.toLowerCase();
  return DANGEROUS_CMDS.some(d => c.includes(d));
}
