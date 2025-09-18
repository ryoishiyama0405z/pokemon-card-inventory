#!/bin/bash

# ポケモンカード在庫管理システム 起動スクリプト

echo "🃏 ポケモンカード在庫管理システムを起動しています..."

# 既存のコンテナを停止
echo "📦 既存のコンテナを停止中..."
docker-compose down

# イメージをビルドして起動
echo "🔨 イメージをビルド中..."
docker-compose build --no-cache

echo "🚀 サービスを起動中..."
docker-compose up -d

# 起動状態を確認
echo "⏳ サービスの起動を待機中..."
sleep 10

# ヘルスチェック
echo "🏥 ヘルスチェック実行中..."

# PostgreSQL確認
if docker-compose exec -T postgres pg_isready -U pokemon_user > /dev/null 2>&1; then
    echo "✅ PostgreSQL: 正常"
else
    echo "❌ PostgreSQL: エラー"
fi

# バックエンド確認
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API: 正常"
else
    echo "❌ Backend API: エラー"
fi

# フロントエンド確認
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend: 正常"
else
    echo "❌ Frontend: エラー"
fi

echo ""
echo "🎉 起動完了！"
echo ""
echo "📱 アクセス方法:"
echo "   フロントエンド: http://localhost:5173"
echo "   API文書:       http://localhost:8000/docs"
echo "   API:           http://localhost:8000"
echo ""
echo "🛑 停止する場合: docker-compose down"
echo "📋 ログ確認:     docker-compose logs -f"
echo ""

# ログの表示開始
echo "📋 リアルタイムログを表示します（Ctrl+Cで終了）:"
docker-compose logs -f