import * as dotenv from 'dotenv';
import { ModelConfig, PromptConfig } from './types';
import { generateWithGemini } from './providers/gemini';
import { generateWithOpenAI } from './providers/openai';
import { generateWithPerplexity } from './providers/perplexity';
import { generateWithTavily } from './providers/tavily';
// 環境変数を読み込む
dotenv.config();
/**
 * プロンプト内のプレースホルダー（{{変数名}}）を実際の値に置き換える
 */
function replacePlaceholders(
  text: string,
  variables: Record<string, string | number>
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
}
/**
 * モデルを実行する統一関数
 */
async function runModel(config: ModelConfig, prompt: PromptConfig) {
  // 変数があればプレースホルダーを置き換え
  const processedPrompt: PromptConfig = {
    systemPrompt: prompt.systemPrompt
      ? prompt.variables
        ? replacePlaceholders(prompt.systemPrompt, prompt.variables)
        : prompt.systemPrompt
      : undefined,
    userPrompt: prompt.variables
      ? replacePlaceholders(prompt.userPrompt, prompt.variables)
      : prompt.userPrompt,
  };
  console.log('\n='.repeat(60));
  console.log(`🤖 モデル: ${config.provider} / ${config.model}`);
  console.log('='.repeat(60));
  // 変数が設定されている場合は表示
  if (prompt.variables) {
    console.log('📌 変数:');
    Object.entries(prompt.variables).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value}`);
    });
    console.log('-'.repeat(60));
  }
  console.log(
    `📝 プロンプト: ${processedPrompt.userPrompt.substring(0, 100)}${
      processedPrompt.userPrompt.length > 100 ? '...' : ''
    }`
  );
  if (processedPrompt.systemPrompt) {
    console.log(
      `⚙️  システムプロンプト: ${processedPrompt.systemPrompt.substring(
        0,
        100
      )}${processedPrompt.systemPrompt.length > 100 ? '...' : ''}`
    );
  }
  console.log('-'.repeat(60));
  try {
    const startTime = Date.now();
    let response;
    if (config.provider === 'gemini') {
      response = await generateWithGemini(config, processedPrompt);
    } else if (config.provider === 'openai') {
      response = await generateWithOpenAI(config, processedPrompt);
    } else if (config.provider === 'perplexity') {
      response = await generateWithPerplexity(config, processedPrompt);
    } else if (config.provider === 'tavily') {
      response = await generateWithTavily(config, processedPrompt);
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
  // model: 使用するモデル名
  const modelConfig: ModelConfig = {
    provider: 'gemini',
    model: 'gemini-2.5-flash-lite',
    tools: ['web_search'], // Web検索ツールを有効化
    // temperature: 0.2,
    // maxTokens: 1000,
  };
  // 変数定義（プロンプト内の{{変数名}}を置き換えます）
  const variables = {
    companyName: '株式会社リクブル',
    companyAddress: '大阪府大阪市淀川区西中島４丁目６番３０号チサンマンション第５新大阪３０６',
  };
  // プロンプト設定
  const promptConfig: PromptConfig = {
    systemPrompt:
      'あなたは企業情報から公式ウェブサイトURLを特定する専門家です。',
    userPrompt: `
      以下の企業名と本社住所に基づき、**唯一の公式企業ウェブサイトURL**を検索し、JSON形式で出力してください。
【企業情報】
- 企業名：{{companyName}}
- 本社住所：{{companyAddress}}

【制約事項】
1. **公式企業サイト**（採用サイト、代理店、同名企業を除く）のみを特定してください。
2. URLはアクセス可能であることを確認してください。
3. 公式サイトが見つからない場合、"companyUrl"の値は推測したURLではなく null としてください。
【出力フォーマット (JSON)】
{
  "companyName": "{{companyName}}",
  "companyAddress": "{{companyAddress}}",
  "companyUrl": "特定されたURL または null",
}
    `,
    variables: variables,
  };
  // ============================================================
  // 実行
  // ============================================================
  await runModel(modelConfig, promptConfig);
}
// スクリプトを実行
main().catch((error) => {
  console.error('予期しないエラーが発生しました:', error);
  process.exit(1);
});
