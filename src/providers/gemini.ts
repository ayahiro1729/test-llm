import { GoogleGenAI } from '@google/genai';
import { ModelConfig, ModelResponse, PromptConfig } from '../types';

/**
 * Gemini APIを使用してテキストを生成
 */
export async function generateWithGemini(
  config: ModelConfig,
  prompt: PromptConfig
): Promise<ModelResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY が設定されていません。.envファイルを確認してください。'
    );
  }

  const genAI = new GoogleGenAI({ apiKey });

  const toolEntries: Array<{ googleSearch: Record<string, unknown> }> = [];
  for (const tool of config.tools ?? []) {
    if (tool === 'web_search') {
      toolEntries.push({ googleSearch: {} });
      continue;
    }

    if (
      typeof tool === 'object' &&
      tool !== null &&
      'googleSearch' in tool &&
      typeof tool.googleSearch === 'object'
    ) {
      toolEntries.push({
        googleSearch: tool.googleSearch as Record<string, unknown>,
      });
    }
  }

  const generationConfig: Record<string, unknown> = {};

  if (prompt.systemPrompt) {
    generationConfig.systemInstruction = prompt.systemPrompt;
  }
  if (config.temperature !== undefined) {
    generationConfig.temperature = config.temperature;
  }
  if (config.maxTokens !== undefined) {
    generationConfig.maxOutputTokens = config.maxTokens;
  }
  if (toolEntries.length > 0) {
    generationConfig.tools = toolEntries;
  }

  try {
    const response = await genAI.models.generateContent({
      model: config.model,
      contents: prompt.userPrompt,
      ...(Object.keys(generationConfig).length > 0
        ? { config: generationConfig }
        : {}),
    });

    const content = response.text ?? '';

    return {
      provider: 'gemini',
      model: config.model,
      content,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount,
        completionTokens: response.usageMetadata?.candidatesTokenCount,
        totalTokens: response.usageMetadata?.totalTokenCount,
      },
      timestamp: new Date(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Gemini API エラー: ${error.message}`);
    }
    throw error;
  }
}
