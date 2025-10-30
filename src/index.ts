import * as dotenv from 'dotenv';
import { ModelConfig, PromptConfig } from './types';
import { generateWithGemini } from './providers/gemini';
import { generateWithOpenAI } from './providers/openai';

// 環境変数を読み込む
dotenv.config();

/**
 * モデルを実行する統一関数
 */
async function runModel(config: ModelConfig, prompt: PromptConfig) {
  console.log('\n='.repeat(60));
  console.log(`🤖 モデル: ${config.provider} / ${config.model}`);
  console.log('='.repeat(60));
  console.log(`📝 プロンプト: ${prompt.userPrompt}`);
  if (prompt.systemPrompt) {
    console.log(`⚙️  システムプロンプト: ${prompt.systemPrompt}`);
  }
  console.log('-'.repeat(60));

  try {
    const startTime = Date.now();

    let response;
    if (config.provider === 'gemini') {
      response = await generateWithGemini(config, prompt);
    } else if (config.provider === 'openai') {
      response = await generateWithOpenAI(config, prompt);
    } else {
      throw new Error(`サポートされていないプロバイダー: ${config.provider}`);
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`\n💬 レスポンス:\n${response.content}`);
    console.log('-'.repeat(60));
    console.log(`⏱️  実行時間: ${duration}秒`);

    if (response.usage) {
      console.log(`📊 使用トークン:`);
      console.log(`   - プロンプト: ${response.usage.promptTokens || 'N/A'}`);
      console.log(`   - 生成: ${response.usage.completionTokens || 'N/A'}`);
      console.log(`   - 合計: ${response.usage.totalTokens || 'N/A'}`);
    }

    console.log('='.repeat(60));
  } catch (error) {
    console.error(
      `\n❌ エラー: ${error instanceof Error ? error.message : String(error)}`
    );
    console.log('='.repeat(60));
  }
}

/**
 * メイン関数
 *
 * ここでモデルとプロンプトを設定して実行します。
 * 異なるモデルを試したい場合は、以下の設定を変更してください。
 */
async function main() {
  // ============================================================
  // 設定セクション - ここを編集してモデルとプロンプトを変更
  // ============================================================

  // モデル設定
  // provider: 'gemini' または 'openai'
  // model: 使用するモデル名
  const modelConfig: ModelConfig = {
    provider: 'gemini', // 'gemini' または 'openai' に変更
    model: 'gemini-1.5-flash', // モデル名を変更
    temperature: 0.7,
    maxTokens: 1000,
  };

  // 利用可能なモデル例:
  // Gemini: 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'
  // OpenAI: 'gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo'

  // プロンプト設定
  const promptConfig: PromptConfig = {
    systemPrompt: 'あなたは親切なアシスタントです。',
    userPrompt: 'TypeScriptの型システムについて簡単に説明してください。',
  };

  // ============================================================
  // 実行
  // ============================================================

  await runModel(modelConfig, promptConfig);

  // 複数のモデルを比較したい場合は、以下のようにコメントを外して使用
  /*
  console.log('\n\n🔄 別のモデルで実行...\n');

  const modelConfig2: ModelConfig = {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
  };

  await runModel(modelConfig2, promptConfig);
  */
}

// スクリプトを実行
main().catch((error) => {
  console.error('予期しないエラーが発生しました:', error);
  process.exit(1);
});
