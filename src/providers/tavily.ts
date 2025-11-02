import axios from 'axios';
import { ModelConfig, ModelResponse, PromptConfig } from '../types';

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  query: string;
  results: TavilySearchResult[];
  answer?: string;
  images?: string[];
  response_time: number;
}

/**
 * Tavily APIを使用してウェブ検索を実行
 * TavilyはLLM向けに最適化された検索APIで、高品質な検索結果を提供
 */
export async function generateWithTavily(
  config: ModelConfig,
  prompt: PromptConfig
): Promise<ModelResponse> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error(
      'TAVILY_API_KEY が設定されていません。.envファイルを確認してください。'
    );
  }

  try {
    // システムプロンプトは無視し、ユーザープロンプトを検索クエリとして使用
    const searchQuery = prompt.userPrompt;

    // Tavily APIのエンドポイント
    const response = await axios.post<TavilyResponse>(
      'https://api.tavily.com/search',
      {
        api_key: apiKey,
        query: searchQuery,
        search_depth: config.model || 'basic', // 'basic' or 'advanced'
        include_answer: true,
        include_raw_content: false,
        max_results: config.maxTokens ? Math.min(config.maxTokens / 100, 10) : 5,
        include_images: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;

    // 検索結果を整形
    let content = '';

    if (data.answer) {
      content += `## 回答\n${data.answer}\n\n`;
    }

    content += `## 検索結果（${data.results.length}件）\n\n`;

    data.results.forEach((result, index) => {
      content += `### ${index + 1}. ${result.title}\n`;
      content += `- URL: ${result.url}\n`;
      content += `- スコア: ${result.score.toFixed(3)}\n`;
      content += `- 内容: ${result.content}\n\n`;
    });

    content += `---\n検索クエリ: ${data.query}\n`;
    content += `応答時間: ${data.response_time.toFixed(2)}秒`;

    // 概算のトークン数を計算（実際のトークン数ではなく文字数ベース）
    const estimatedTokens = Math.ceil(content.length / 4);

    return {
      provider: 'tavily',
      model: config.model || 'basic',
      content: content,
      usage: {
        promptTokens: Math.ceil(searchQuery.length / 4),
        completionTokens: estimatedTokens,
        totalTokens: Math.ceil(searchQuery.length / 4) + estimatedTokens,
      },
      timestamp: new Date(),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      throw new Error(`Tavily API エラー: ${message}`);
    }
    if (error instanceof Error) {
      throw new Error(`Tavily API エラー: ${error.message}`);
    }
    throw error;
  }
}

