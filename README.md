# test-llm

Gemini、OpenAI、Perplexity、Tavilyをローカルでテストするための開発環境です。モデルとプロンプトを簡単に切り替えて、最適な設定を探索できます。

## 📋 必要要件

- Node.js (v16以上推奨)
- Gemini API Key ([Google AI Studio](https://makersuite.google.com/app/apikey)から取得)
- OpenAI API Key ([OpenAI Platform](https://platform.openai.com/api-keys)から取得)
- Perplexity API Key ([Perplexity Settings](https://www.perplexity.ai/settings/api)から取得)
- Tavily API Key ([Tavily App](https://app.tavily.com/)から取得)

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、APIキーを設定します。

```bash
cp .env.example .env
```

`.env`ファイルを編集してAPIキーを設定：

```env
GEMINI_API_KEY=your_actual_gemini_api_key
OPENAI_API_KEY=your_actual_openai_api_key
PERPLEXITY_API_KEY=your_actual_perplexity_api_key
TAVILY_API_KEY=your_actual_tavily_api_key
```

## 💡 使い方

### 基本的な使い方

1. `src/index.ts`を開く
2. モデル設定とプロンプトを編集
3. 実行

```bash
npm start
```

### モデルの切り替え

`src/index.ts`の`modelConfig`を編集します：

```typescript
const modelConfig: ModelConfig = {
  provider: 'gemini',  // 'gemini'、'openai'、'perplexity'、'tavily'
  model: 'gemini-1.5-flash',  // モデル名
  temperature: 0.7,    // 0.0 〜 2.0（検索APIでは未使用）
  maxTokens: 1000,     // 最大トークン数（検索APIでは検索結果数の制御に使用）
};
```

### プロンプトの変更

`src/index.ts`の`promptConfig`を編集します：

```typescript
const promptConfig: PromptConfig = {
  systemPrompt: 'あなたは親切なアシスタントです。',
  userPrompt: 'ここにあなたの質問やプロンプトを入力',
};
```

### 変数の使用

プロンプト内に`{{変数名}}`の形式でプレースホルダーを使用できます：

```typescript
// 変数を定義
const variables = {
  company_name: '株式会社Example',
  address: '東京都渋谷区example 1-2-3',
};

// プロンプトで変数を使用
const promptConfig: PromptConfig = {
  systemPrompt: 'あなたは企業情報を分析するアシスタントです。',
  userPrompt: '企業名：{{company_name}}、住所：{{address}}の情報を分析してください。',
  variables: variables,
};
```

変数は自動的にプレースホルダーと置き換えられ、実行時に表示されます。

## 🤖 利用可能なモデル

### Gemini

- `gemini-1.5-pro` - 高性能モデル
- `gemini-1.5-flash` - 高速で軽量なモデル
- `gemini-2.0-flash-exp` - 最新の実験モデル

### OpenAI

- `gpt-4` - 最も高性能なモデル
- `gpt-4-turbo` - GPT-4の高速版
- `gpt-3.5-turbo` - コスト効率の良いモデル

### Perplexity

Perplexityはリアルタイムのウェブ検索機能を持つLLMで、最新情報の取得に優れています。

- `llama-3.1-sonar-small-128k-online` - 小型で高速なオンライン検索モデル
- `llama-3.1-sonar-large-128k-online` - 大型で高性能なオンライン検索モデル
- `llama-3.1-sonar-huge-128k-online` - 最大規模のオンライン検索モデル

### Tavily

TavilyはLLM向けに最適化された検索APIで、高品質な検索結果とAI生成の回答を提供します。

- `basic` - 基本的な検索（デフォルト、高速）
- `advanced` - 高度な検索（より詳細な結果）

**注意**: Tavilyは検索APIのため、`userPrompt`が検索クエリとして使用されます。`systemPrompt`は無視されます。


## 📊 実行結果の例

```
============================================================
🤖 モデル: gemini / gemini-1.5-flash
============================================================
📌 変数:
   - company_name: 株式会社Example
   - address: 東京都渋谷区example 1-2-3
------------------------------------------------------------
📝 プロンプト: 以下の情報をもとに、企業の「公式サイトURL」を1つ推定してください...
⚙️  システムプロンプト: あなたは日本企業の公式ウェブサイトを特定する専門アシスタントです。
------------------------------------------------------------

💬 レスポンス:
{
  "企業名": "株式会社Example",
  "住所": "東京都渋谷区example 1-2-3",
  ...
}
------------------------------------------------------------
⏱️  実行時間: 2.45秒
📊 使用トークン:
   - プロンプト: 123
   - 生成: 256
   - 合計: 379
============================================================
```

## 🔄 複数モデルの比較

複数のモデルを比較したい場合は、`src/index.ts`内のコメントアウトされたコードを有効にします：

```typescript
// 複数のモデルを比較したい場合
await runModel(modelConfig1, promptConfig);
await runModel(modelConfig2, promptConfig);
```

## 📁 プロジェクト構造

```
test-llm/
├── src/
│   ├── index.ts              # メインスクリプト（ここを編集）
│   ├── types.ts              # 型定義
│   └── providers/
│       ├── gemini.ts         # Gemini API実装
│       ├── openai.ts         # OpenAI API実装
│       ├── perplexity.ts     # Perplexity API実装
│       └── tavily.ts         # Tavily API実装
├── .env                      # 環境変数（gitignore対象）
├── .env.example              # 環境変数のテンプレート
├── package.json
└── tsconfig.json
```

## ⚙️ その他のコマンド

```bash
# TypeScriptのビルド
npm run build

# ビルドせずに直接実行
npm run dev
```

## 🔒 セキュリティ

- `.env`ファイルはGitにコミットされません
- APIキーは必ず環境変数で管理してください
- APIキーを含むファイルは共有しないでください

## 📝 開発のヒント

- プロンプトエンジニアリングの実験に最適
- モデルごとのレスポンスの違いを比較
- 温度（temperature）やトークン数を調整して出力を制御
- 実行時間とトークン使用量を確認してコスト最適化
- **Perplexity**: 最新情報の検索やウェブサイトの確認に適しています
- **Tavily**: 純粋な検索結果が必要な場合や、AI生成の回答と検索結果の両方が欲しい場合に最適

## 💡 使用例

### Tavilyで企業情報を検索

```typescript
const modelConfig: ModelConfig = {
  provider: 'tavily',
  model: 'advanced',
};

const promptConfig: PromptConfig = {
  userPrompt: '株式会社Example 東京都 公式サイト',
};
```

### Perplexityで最新情報を取得

```typescript
const modelConfig: ModelConfig = {
  provider: 'perplexity',
  model: 'llama-3.1-sonar-large-128k-online',
};

const promptConfig: PromptConfig = {
  systemPrompt: 'あなたは企業調査の専門家です。',
  userPrompt: '株式会社Exampleの公式サイトURLを特定してください。',
};
```

### Geminiでプロンプトに変数を使用

```typescript
const variables = {
  companyName: '株式会社Example',
  companyAddress: '東京都渋谷区',
};

const modelConfig: ModelConfig = {
  provider: 'gemini',
  model: 'gemini-1.5-pro',
};

const promptConfig: PromptConfig = {
  systemPrompt: '企業情報を分析するアシスタント',
  userPrompt: '企業名: {{companyName}}, 住所: {{companyAddress}}',
  variables: variables,
};
```
