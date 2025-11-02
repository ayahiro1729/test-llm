import OpenAI from 'openai';
import { ModelConfig, ModelResponse, PromptConfig } from '../types';

/**
 * OpenAI APIを使用してテキストを生成
 */
export async function generateWithOpenAI(
  config: ModelConfig,
  prompt: PromptConfig
): Promise<ModelResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY が設定されていません。.envファイルを確認してください。');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const inputs: Array<{
      role: 'system' | 'user';
      content: Array<{ type: 'input_text'; text: string }>;
    }> = [];

    if (prompt.systemPrompt) {
      inputs.push({
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: prompt.systemPrompt,
          },
        ],
      });
    }

    inputs.push({
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: prompt.userPrompt,
        },
      ],
    });

    const params: Record<string, unknown> = {
      model: config.model,
      input: inputs,
    };

    if (config.temperature !== undefined) {
      params.temperature = config.temperature;
    }

    if (config.maxTokens !== undefined) {
      params.max_output_tokens = config.maxTokens;
    }

    if (config.tools?.includes('web_search')) {
      params.tools = [{ type: 'web_search' as const }];
    }

    const completion = await openai.responses.create(params as any);

    const content = completion.output_text ?? '';

    return {
      provider: 'openai',
      model: config.model,
      content: content,
      usage: {
        promptTokens: completion.usage?.input_tokens,
        completionTokens: completion.usage?.output_tokens,
        totalTokens: completion.usage?.total_tokens,
      },
      timestamp: new Date(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API エラー: ${error.message}`);
    }
    throw error;
  }
}
