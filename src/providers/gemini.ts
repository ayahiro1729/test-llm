import { GoogleGenerativeAI } from '@google/generative-ai';
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

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: config.model,
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: config.maxTokens,
    },
  });

  try {
    // システムプロンプトとユーザープロンプトを結合
    const fullPrompt = prompt.systemPrompt
      ? `${prompt.systemPrompt}\n\n${prompt.userPrompt}`
      : prompt.userPrompt;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return {
      provider: 'gemini',
      model: config.model,
      content: text,
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
