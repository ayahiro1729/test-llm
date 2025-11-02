/**
 * サポートされているLLMプロバイダー
 */
export type Provider =
  | 'gemini'
  | 'openai'
  | 'perplexity'
  | 'tavily'

/**
 * モデル設定
 */
export interface ModelConfig {
  provider: Provider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  tools?: ToolType[];
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
  variables?: Record<string, string | number>;
}

/**
 * ツール設定
 * - OpenAI: 'web_search'
 * - Gemini: { googleSearch: { ... } }
 */
export type ToolType =
  | 'web_search'
  | {
      googleSearch: Record<string, unknown>;
    };
