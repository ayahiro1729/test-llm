# test-llm

GeminiとOpenAI APIをローカルでテストするための開発環境です。モデルとプロンプトを簡単に切り替えて、最適な設定を探索できます。

## 📋 必要要件

- Node.js (v16以上推奨)
- Gemini API Key ([Google AI Studio](https://makersuite.google.com/app/apikey)から取得)
- OpenAI API Key ([OpenAI Platform](https://platform.openai.com/api-keys)から取得)

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
  provider: 'gemini',  // 'gemini' または 'openai'
  model: 'gemini-1.5-flash',  // モデル名
  temperature: 0.7,    // 0.0 〜 2.0
  maxTokens: 1000,     // 最大トークン数
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

## 🤖 利用可能なモデル

### Gemini

- `gemini-1.5-pro` - 高性能モデル
- `gemini-1.5-flash` - 高速で軽量なモデル
- `gemini-1.0-pro` - 旧バージョンの標準モデル

### OpenAI

- `gpt-4` - 最も高性能なモデル
- `gpt-4-turbo-preview` - GPT-4の高速版
- `gpt-3.5-turbo` - コスト効率の良いモデル

## 📊 実行結果の例

```
============================================================
🤖 モデル: gemini / gemini-1.5-flash
============================================================
📝 プロンプト: TypeScriptの型システムについて簡単に説明してください。
⚙️  システムプロンプト: あなたは親切なアシスタントです。
------------------------------------------------------------

💬 レスポンス:
TypeScriptの型システムは...
------------------------------------------------------------
⏱️  実行時間: 2.45秒
📊 使用トークン:
   - プロンプト: 23
   - 生成: 156
   - 合計: 179
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
│       └── openai.ts         # OpenAI API実装
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
