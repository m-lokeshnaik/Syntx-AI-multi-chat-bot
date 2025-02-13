export interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
  model: AIModel;
}

export type AIModel = 'gemini' | 'gpt' | 'claude' | 'deepseek';

export interface ModelConfig {
  id: AIModel;
  name: string;
  icon: string;
  category: 'Basic' | 'Advanced';
  apiKey: string;
}