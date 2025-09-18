# ポケモンカード在庫管理システム

完全に動作するポケモンカード在庫管理システムです。Docker環境で動作し、カード情報・在庫・価格履歴を管理し、Pokemon TCG APIと連携してモバイル対応のPWAアプリとして提供されます。

## 🚀 機能

- **カード管理**: ポケモンカードの詳細情報管理
- **在庫追跡**: リアルタイムの在庫数管理
- **価格履歴**: 価格変動の記録と可視化チャート
- **Pokemon TCG API連携**: 公式APIからのカード情報取得
- **CSV一括更新**: エクセルファイルからの大量データインポート
- **PWA対応**: オフライン機能付きモバイルアプリ
- **レスポンシブ**: デスクトップ・タブレット・スマートフォン対応

## 🛠 技術スタック

### バックエンド
- **FastAPI**: 高性能なPython APIフレームワーク
- **PostgreSQL**: リレーショナルデータベース
- **SQLAlchemy**: ORM
- **httpx**: Pokemon TCG API連携

### フロントエンド
- **React 18**: UIライブラリ
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: ユーティリティファーストCSS
- **Chart.js**: 価格チャート表示
- **React Query**: データフェッチング管理

### インフラ
- **Docker**: コンテナ化
- **Docker Compose**: マルチサービス管理

## 📋 必要な条件

- Docker
- Docker Compose
- 8GB以上のRAM（推奨）

## 🚀 クイックスタート

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd pokemon-card-inventory
```

### 2. 環境変数の設定
```bash
# .envファイルを確認・編集
cp .env.example .env
# 必要に応じてデータベース認証情報やAPIキーを変更
```

### 3. システムの起動
```bash
# 全サービスを起動
docker-compose up --build

# バックグラウンドで起動する場合
docker-compose up -d --build
```

### 4. アクセス
- **フロントエンド**: http://localhost:5173
- **API文書**: http://localhost:8000/docs
- **バックエンドAPI**: http://localhost:8000

## 📱 PWA機能

このアプリはPWA（Progressive Web App）として設計されており、以下の機能が利用できます：

- **ホーム画面に追加**: スマートフォンのホーム画面にアプリアイコンを追加
- **オフライン機能**: ネットワークがない状態でも基本機能を利用可能
- **プッシュ通知**: 価格変動などの重要な通知（将来実装予定）

### PWAのインストール方法
1. ブラウザでアプリにアクセス
2. アドレスバーの「インストール」ボタンをクリック
3. 確認ダイアログで「インストール」を選択

## 📊 使用方法

### カードの追加
1. 「カード追加」ページに移動
2. カード情報を入力
3. Pokemon TCG APIから情報を自動取得（オプション）
4. 保存

### CSV一括インポート
1. 「在庫管理」ページで「CSV取込」をクリック
2. テンプレートをダウンロード
3. Excelで編集してCSVで保存
4. ファイルをドラッグ&ドロップでアップロード

### 価格履歴の確認
1. カード詳細ページで価格チャートを確認
2. 価格履歴データを手動追加可能
3. 複数の期間での価格推移を可視化

## 🔧 開発者向け情報

### プロジェクト構造
```
pokemon-card-inventory/
├── backend/                 # FastAPI バックエンド
│   ├── app/
│   │   ├── crud/           # データベース操作
│   │   ├── models/         # SQLAlchemyモデル
│   │   ├── routers/        # APIエンドポイント
│   │   ├── schemas/        # Pydanticスキーマ
│   │   └── services/       # ビジネスロジック
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # React フロントエンド
│   ├── src/
│   │   ├── components/     # 再利用可能コンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── services/       # API通信
│   │   └── types/          # TypeScript型定義
│   ├── public/             # 静的ファイル
│   └── Dockerfile
├── docker-compose.yml      # マルチサービス設定
└── .env                    # 環境変数
```

### API エンドポイント

#### カード管理
- `GET /api/cards/` - カード一覧取得
- `POST /api/cards/` - カード作成
- `PUT /api/cards/{id}` - カード更新
- `DELETE /api/cards/{id}` - カード削除
- `POST /api/cards/bulk-upload` - CSV一括アップロード

#### 在庫管理
- `GET /api/cards/inventory/` - 在庫一覧取得
- `POST /api/cards/inventory/` - 在庫作成
- `PUT /api/cards/inventory/{id}` - 在庫更新

#### Pokemon TCG API
- `GET /api/pokemon-tcg/search` - カード検索
- `GET /api/pokemon-tcg/card/{id}` - カード詳細取得
- `GET /api/pokemon-tcg/sets` - セット一覧取得

### ローカル開発

#### バックエンドのみ起動
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### フロントエンドのみ起動
```bash
cd frontend
npm install
npm run dev
```

### データベースマイグレーション
```bash
# コンテナ内でマイグレーション実行
docker-compose exec backend python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

## 🌍 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `DATABASE_URL` | PostgreSQL接続URL | `postgresql://pokemon_user:P0k3m0n_C4rd_2024!@postgres:5432/pokemon_cards` |
| `SECRET_KEY` | JWT署名用秘密鍵 | ランダム文字列 |
| `POKEMON_TCG_API_KEY` | Pokemon TCG API キー | なし（オプション） |
| `FRONTEND_URL` | フロントエンドURL（CORS用） | `http://localhost:5173` |

## 🐛 トラブルシューティング

### よくある問題

1. **データベース接続エラー**
   ```bash
   # PostgreSQLコンテナの状態確認
   docker-compose logs postgres

   # データベースコンテナを再起動
   docker-compose restart postgres
   ```

2. **フロントエンドがAPIに接続できない**
   - `.env`ファイルの`VITE_API_URL`を確認
   - CORSエラーの場合は`FRONTEND_URL`を確認

3. **ポートが使用中のエラー**
   ```bash
   # 使用中のポートを確認
   netstat -an | grep :8000
   netstat -an | grep :5173

   # docker-compose.ymlでポート変更
   ```

4. **PWAが更新されない**
   - ブラウザのキャッシュをクリア
   - Service Workerを手動で更新

## 📈 パフォーマンス最適化

- **データベース**: インデックスの追加
- **フロントエンド**: React.memoとuseMemoの活用
- **API**: ページネーションとキャッシング
- **画像**: WebP形式の使用とサイズ最適化

## 🔒 セキュリティ

- 環境変数による機密情報管理
- SQLインジェクション防止（SQLAlchemy ORM使用）
- CORS設定によるアクセス制御
- Docker非rootユーザーでの実行

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

質問や問題がある場合は、GitHubのIssuesで報告してください。

---

⚡ **楽しいポケモンカード管理を！** ⚡