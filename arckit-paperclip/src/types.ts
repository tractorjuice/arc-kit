export interface CommandHandoff {
  command: string;
  description: string;
  condition?: string;
}

export interface CommandEntry {
  name: string;
  description: string;
  prompt: string;
  template: string | null;
  handoffs: CommandHandoff[];
}
