# JSON-Serverを使った汎用REST API

JSONファイルとルート設定を追加するだけで簡単に新しいエンドポイントを追加できる、JSON-Serverで構築された柔軟なREST APIサーバーです。

## 機能

- 設定に基づく動的ルーティング
- 完全なCRUD操作（GET、POST、PUT、DELETE）
- ファイルベースのデータストレージ
- 簡単なエンドポイント追加
- 新しいレコードの自動ID生成

## 始め方

1. 依存関係をインストール:
```bash
npm install
```

2. サーバーを開始:
```bash
npm start
```

サーバーは `http://localhost:3000` で実行されます

## 利用可能なエンドポイント

- `GET /api/users` - 全てのユーザーを取得
- `GET /api/users/:id` - IDでユーザーを取得
- `POST /api/users` - 新しいユーザーを作成
- `PUT /api/users/:id` - ユーザーを更新
- `DELETE /api/users/:id` - ユーザーを削除

以下のエンドポイントでも同様の操作が利用可能です:
- `/api/posts`
- `/api/comments`
- `/api/products`

## 新しいAPIの追加

新しいAPIエンドポイントを追加するには:

1. `./data/` ディレクトリにJSONファイルを作成（例: `./data/orders.json`）
2. `server.js` の `routesConfig` にルートマッピングを追加:
   ```javascript
   const routesConfig = {
     // 既存のルート...
     '/api/orders': './data/orders.json'
   };
   ```
3. サーバーを再起動

新しいエンドポイントは自動的に全てのCRUD操作をサポートします。

## JSONファイルの構造例

各JSONファイルは、一意の `id` フィールドを持つオブジェクトの配列を含む必要があります:

```json
[
  {
    "id": 1,
    "name": "サンプルアイテム",
    "description": "これは例です"
  }
]
```

## API操作

### 全てのアイテムを取得
```bash
curl http://localhost:3000/api/users
```

### IDでアイテムを取得
```bash
curl http://localhost:3000/api/users/1
```

### 新しいアイテムを作成
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "新しいユーザー", "email": "user@example.com"}'
```

### アイテムを更新
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "更新されたユーザー", "email": "updated@example.com"}'
```

### アイテムを削除
```bash
curl -X DELETE http://localhost:3000/api/users/1
```