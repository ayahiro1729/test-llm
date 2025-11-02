import OpenAI from 'openai';
import { ModelConfig, ModelResponse, PromptConfig } from '../types';

/**
 * Perplexity APIを使用してテキストを生成
 * Perplexityはリアルタイム検索機能を持つLLMで、OpenAI互換のAPIを提供
 */
export async function generateWithPerplexity(
  config: ModelConfig,
  prompt: PromptConfig
): Promise<ModelResponse> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY が設定されていません。.envファイルを確認してください。');
  }

  const perplexity = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.perplexity.ai',
  });

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    // システムプロンプトがあれば追加
    if (prompt.systemPrompt) {
      messages.push({
        role: 'system',
        content: prompt.systemPrompt,
      });
    }

    // ユーザープロンプトを追加
    messages.push({
      role: 'user',
      content: prompt.userPrompt,
    });

    const completion = await perplexity.chat.completions.create({
      model: config.model,
      messages: messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });

    const content = completion.choices[0]?.message?.content || '';

    return {
      provider: 'perplexity',
      model: config.model,
      content: content,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
        totalTokens: completion.usage?.total_tokens,
      },
      timestamp: new Date(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Perplexity API エラー: ${error.message}`);
    }
    throw error;
  }
}

