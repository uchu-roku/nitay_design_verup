# デプロイ状況

## 📅 最終更新日時
2026年2月4日 22:50

## 🌐 デプロイ先
https://uchu-roku.github.io/nitay_designtest/

## ✅ 最新のデプロイ

### コミット情報
- **コミットID**: b5059c7
- **メッセージ**: fix: 市町村コードマッピングを追加（北斗市・函館市を含む全11市町村対応）
- **日時**: 2026年2月4日 22:50

### 変更内容

#### 追加されたファイル
1. `backend/create_municipality_mapping.py` - 市町村コードマッピング生成スクリプト
2. `backend/data/administrative/rinsyousigen/municipality_mapping.json` - 2桁→5桁コードマッピング
3. `frontend/public/data/administrative/kitamirinsyou/municipality_mapping.json` - フロントエンド用マッピング

#### 修正されたファイル
1. `backend/data/administrative/rinsyousigen/municipality_codes.json` - 市町村名マスター（文字化け修正）
2. `frontend/public/data/administrative/kitamirinsyou/municipality_codes.json` - フロントエンド用市町村名マスター

### 解決した問題

**問題**: 北斗市（コード05）と函館市（コード19）が市町村リストに表示されない

**原因**: 
- 2桁の市町村コード（05, 19）と5桁の全国地方公共団体コード（01050, 01190）の混在
- マッピングファイルが存在せず、フロントエンドが正しくファイルを読み込めなかった

**解決策**:
- `municipality_mapping.json` を作成し、2桁コードと5桁コードをマッピング
- 全11市町村（松前町、福島町、知内町、木古内町、北斗市、七飯町、鹿部町、森町、八雲町、長万部町、函館市）に対応

## 📊 対応市町村一覧

| 2桁コード | 5桁コード | 市町村名 | データ件数 |
|----------|----------|---------|-----------|
| 01 | 01010 | 松前町 | 5,126件 |
| 02 | 01020 | 福島町 | 5,793件 |
| 03 | 01030 | 知内町 | 5,689件 |
| 04 | 01040 | 木古内町 | 8,477件 |
| 05 | 01050 | **北斗市** | **8,178件** |
| 07 | 01070 | 七飯町 | 5,248件 |
| 13 | 01130 | 鹿部町 | 4,394件 |
| 15 | 01150 | 森町 | 12,430件 |
| 16 | 01160 | 八雲町 | 24,096件 |
| 17 | 01170 | 長万部町 | 5,337件 |
| 19 | 01190 | **函館市** | **18,926件** |

**合計**: 103,694件

## 🔍 確認方法

### 1. GitHub Actions の確認

https://github.com/uchu-roku/nitay_design_verup/actions

最新のワークフロー（コミット b5059c7）が成功しているか確認してください。

### 2. デプロイされたサイトの確認

https://uchu-roku.github.io/nitay_designtest/

以下を確認：
- [x] サイトが表示される
- [ ] 市町村リストに「北斗市」と「函館市」が表示される
- [ ] 「森林簿レイヤ ON」ボタンをクリック
- [ ] 小班データが地図上に表示される
- [ ] 小班をクリックして層データが表示される

## 📝 技術的な詳細

### データ構造

#### municipality_codes.json（市町村名マスター）
```json
{
  "01": "松前町",
  "05": "北斗市",
  "19": "函館市",
  ...
}
```

#### municipality_mapping.json（コードマッピング）
```json
{
  "05": {
    "code5": "01050",
    "name": "北斗市"
  },
  "19": {
    "code5": "01190",
    "name": "函館市"
  },
  ...
}
```

#### レイヤーファイル
- `layers_01050.json` - 北斗市の層データ（7.3MB）
- `layers_01190.json` - 函館市の層データ（16.8MB）

### フロントエンドでの使用方法

```javascript
// municipality_mapping.json を読み込み
const mapping = await fetch('data/administrative/kitamirinsyou/municipality_mapping.json')
  .then(res => res.json())

// 2桁コードから5桁コードを取得
const code2 = '05' // 北斗市
const code5 = mapping[code2].code5 // '01050'

// レイヤーファイルを読み込み
const layers = await fetch(`data/administrative/kitamirinsyou/split/layers_${code5}.json`)
  .then(res => res.json())
```

## 🚀 次のステップ

1. ✅ GitHub Actions のビルドが成功することを確認
2. ✅ デプロイされたサイトにアクセス
3. [ ] 市町村リストで「北斗市」「函館市」が表示されることを確認
4. [ ] 各市町村のデータが正しく読み込まれることを確認

## 📞 トラブルシューティング

### GitHub Actions が失敗する場合

1. Actions タブでログを確認
2. ビルドエラーがないか確認
3. 必要に応じてコードを修正

### 市町村が表示されない場合

1. ブラウザのコンソールでエラーを確認
2. `municipality_mapping.json` が正しく読み込まれているか確認
3. ネットワークタブでファイルの読み込み状況を確認

### データが表示されない場合

1. レイヤーファイル（`layers_*.json`）が存在するか確認
2. ファイルサイズが正しいか確認（LFSポインタでないこと）
3. JSONの構造が正しいか確認

## 📚 関連ドキュメント

- [データ管理ガイド](.kiro/steering/data-management.md)
- [デプロイガイド](docs/DEPLOYMENT.md)
- [GitHub Pages設定](docs/RENDER_DEPLOY_GUIDE.md)
