# 新リポジトリセットアップ完了

## 実施内容

### 1. データファイルの再生成
- Shapefileと調査簿Excelから実データを生成
- `backend/convert_forest_registry_to_geojson.py` を実行
- `backend/split_layers_by_municipality.py` で市町村コード別に分割
- `backend/prepare_frontend_data.py` でフロントエンド用データを準備

### 2. 生成されたファイル

#### バックエンド（データ生成用）
- `backend/data/administrative/rinsyousigen/split/layers_*.json` (11ファイル、市町村コード別)
- 各ファイルサイズ: 2.8MB～17.4MB

#### フロントエンド（デプロイ用）
- `frontend/public/data/administrative/kitamirinsyou/split/forest_part_1.geojson` (38.55MB)
- `frontend/public/data/administrative/kitamirinsyou/split/forest_part_2.geojson` (35.97MB)
- `frontend/public/data/administrative/kitamirinsyou/split/forest_part_3.geojson` (40.58MB)
- `frontend/public/data/administrative/kitamirinsyou/split/forest_part_4.geojson` (4.56MB)
- `frontend/public/data/administrative/kitamirinsyou/split/layers_*.json` (11ファイル)
- `frontend/public/data/administrative/kitamirinsyou/split/index.json`
- `frontend/public/data/administrative/kitamirinsyou/municipality_codes.json`

### 3. Git LFSの完全削除
- `.gitattributes` からLFS設定を削除
- 全てのファイルを実データに置き換え
- LFSポインタファイルを削除

### 4. 新リポジトリへのプッシュ
- リポジトリ: https://github.com/uchu-roku/nitay_design_verup
- ブランチ: `clean-main`
- コミット: 初回コミット完了
- 100MB以上のファイルは除外（GitHubの制限対応）

### 5. GitHub Actions ワークフローの更新
- トリガーブランチを `main` → `clean-main` に変更
- `VITE_API_URL` 環境変数を削除（静的ファイル使用のため）

## 次のステップ

### GitHub Pages の設定

1. GitHubリポジトリの設定ページを開く
   https://github.com/uchu-roku/nitay_design_verup/settings/pages

2. 以下の設定を行う：
   - **Source**: GitHub Actions
   - **Branch**: 設定不要（GitHub Actionsが自動デプロイ）

3. GitHub Actionsが自動実行されるのを待つ
   - https://github.com/uchu-roku/nitay_design_verup/actions

4. デプロイ完了後、以下のURLでアクセス可能：
   - https://uchu-roku.github.io/nitay_design_verup/

## 確認事項

### ✅ 完了
- [x] 実データの生成
- [x] データファイルの分割
- [x] Git LFSの削除
- [x] 新リポジトリへのプッシュ
- [x] GitHub Actions ワークフローの更新

### ⏳ 要確認
- [ ] GitHub Pages の設定
- [ ] デプロイの動作確認
- [ ] 森林簿レイヤの読み込み確認

## トラブルシューティング

### デプロイが失敗する場合
1. GitHub Actions のログを確認
2. ビルドエラーがないか確認
3. 必要に応じて `npm install` を再実行

### データが読み込めない場合
1. ブラウザのコンソールでエラーを確認
2. ファイルパスが正しいか確認
3. 分割ファイルが全て存在するか確認

## データ管理ポリシー

今後は `.kiro/steering/data-management.md` に記載されたポリシーに従ってください：

- **Git LFSは使用しない**
- **100MB以上のファイルは分割する**
- **バックエンドの大容量ファイルはリポジトリに含めない**
- **フロントエンドは分割ファイルを使用**
