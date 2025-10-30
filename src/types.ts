/**
 * サポートされているLLMプロバイダー
 */
export type Provider = 'gemini' | 'openai';

/**
 * モデル設定
 */
export interface ModelConfig {
  provider: Provider;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * 統一されたレスポンス型
 */
export interface ModelResponse {
  provider: Provider;
  model: string;
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  timestamp: Date;
}

/**
 * プロンプト設定
 */
export interface PromptConfig {
  systemPrompt?: string;
  userPrompt: string;
}
