# Firebase Authentication セットアップガイド

このプロジェクトでは、Firebase Authenticationを使用してログイン機能を実装しています。

## セットアップ手順

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力して作成

### 2. Authenticationの有効化

1. Firebase Consoleで「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブで以下の認証方法を有効化：
   - メール/パスワード
   - Google

### 3. 環境変数の設定

1. `env.example`ファイルを`.env`にコピー
2. Firebase Consoleの「プロジェクトの設定」→「全般」から設定値を取得
3. `.env`ファイルに実際の値を設定：

```env
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 4. アプリケーションの起動

```bash
npm start
```

## 機能

- **メール/パスワード認証**: 新規登録とログイン
- **Google認証**: Googleアカウントでのログイン
- **ログアウト**: セッション終了
- **認証状態の管理**: ログイン状態の自動検出

## ファイル構成

- `src/firebase.js`: Firebase設定
- `src/components/Auth.js`: 認証コンポーネント
- `src/components/Auth.css`: 認証UIのスタイル
- `src/App.js`: メインアプリケーション

## 注意事項

- `.env`ファイルはGitにコミットしないでください
- 本番環境では適切なセキュリティルールを設定してください
- Google認証を使用する場合は、Firebase Consoleで承認済みドメインを設定してください
