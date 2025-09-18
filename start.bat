@echo off
REM ポケモンカード在庫管理システム 起動スクリプト (Windows)

echo 🃏 ポケモンカード在庫管理システムを起動しています...

REM 既存のコンテナを停止
echo 📦 既存のコンテナを停止中...
docker-compose down

REM イメージをビルドして起動
echo 🔨 イメージをビルド中...
docker-compose build --no-cache

echo 🚀 サービスを起動中...
docker-compose up -d

REM 起動状態を確認
echo ⏳ サービスの起動を待機中...
timeout /t 10 /nobreak > nul

echo 🏥 ヘルスチェック実行中...

REM PostgreSQL確認
docker-compose exec -T postgres pg_isready -U pokemon_user > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ PostgreSQL: 正常
) else (
    echo ❌ PostgreSQL: エラー
)

REM バックエンド確認
curl -s http://localhost:8000/health > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend API: 正常
) else (
    echo ❌ Backend API: エラー
)

REM フロントエンド確認
curl -s http://localhost:5173 > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Frontend: 正常
) else (
    echo ❌ Frontend: エラー
)

echo.
echo 🎉 起動完了！
echo.
echo 📱 アクセス方法:
echo    フロントエンド: http://localhost:5173
echo    API文書:       http://localhost:8000/docs
echo    API:           http://localhost:8000
echo.
echo 🛑 停止する場合: docker-compose down
echo 📋 ログ確認:     docker-compose logs -f
echo.

REM ブラウザを自動で開く
start http://localhost:5173

echo 📋 リアルタイムログを表示します（Ctrl+Cで終了）:
docker-compose logs -f