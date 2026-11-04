export interface Tool {
  name: string;
  description: string;
  parameters: any;
  execute: (args: any, ctx: any) => Promise<any>;
  risk?: "low" | "medium" | "high";
}

export class ToolRegistry {
  private tools = new Map<string, Tool>();
  register(t: Tool) { this.tools.set(t.name, t); }
  list() { return Array.from(this.tools.values()); }
  get(name: string) { return this.tools.get(name); }
  schema() {
    return this.list().map(t => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      }
    }));
  }
}

export const registry = new ToolRegistry();
