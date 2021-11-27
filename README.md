# github-desktop-notification
GitHubの[Notificationsページ](https://github.com/notifications)の更新をデスクトップに通知するChrome拡張機能です。

### 事前準備
1. ブラウザでGitHubにログインしておいて下さい。
1. GitHub設定ページの[通知設定](https://github.com/settings/notifications)でWEBへの通知をオンにしてください。（こうするとGitHubのNotificationsページに通知が表示されます）
1. パソコン本体の設定でブラウザの通知設定を許可しておいてください。
### 手順
1. Chromeのツールバーに本拡張機能を表示してください。
1. ツールバーのアイコンをクリックし、ポップアップから'START'をクリック。
1. 上記ページを開いている間、自動で通知をチェックしに行きます。（毎分実行）※タブにピン留めして小さくしておくと邪魔になりにくいです
1. もし新しい通知があれば、デスクトップ通知を行います。
1. デスクトップ通知をクリックするとGitHubのNotificationsページを開きます。

### 備考
1. Notificationsページへのチェックはバックグラウンドで実行されます。
1. ブラウザでGitHubのNotificationsページを開いておく必要はありません。
1. GitHubのNotificationsページを開いていない場合、デスクトップ通知をクリックすると新しいタブでNotificationsページを開きます。
1. GitHubのNotificationsページを開いている場合、デスクトップ通知をクリックするとNotificationsページを開いているタブをアクティブにします。

### 注意事項
1. GitHubのNotificationsページのデザインが変わった場合、通知がうまくいかない可能性があります。（気付き次第修正します）

### リンク
- [ソースコード（GitHub）](https://github.com/hisw-29/github-desktop-notification)
- [chromeウェブストア](https://chrome.google.com/webstore/detail/github-desktop-notificati/iecnfgcbbajncgiianhoaongialneaam)