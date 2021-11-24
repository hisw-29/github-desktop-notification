# github-desktop-notification
GitHubのNotificationsページの更新をデスクトップに通知するChrome拡張機能です。
A chrome extension that notifies your desktop of github web notifications

### 事前準備
1. ブラウザでGitHubにログインしておいて下さい。
1. 設定ページの通知設定でWEBへの通知をオンにしてください。
1. パソコン本体の設定でブラウザの通知設定を許可しておいてください。
### 手順　steps
1. Chromeのツールバーに本拡張機能を表示してください。
1. ツールバーのアイコンをクリックし、ポップアップから'START'をクリック。
1. 上記ページを開いている間、自動で通知をチェックしに行きます。（毎分実行）
1. もし新しい通知があれば、デスクトップ通知を行います。
1. デスクトップ通知をクリックするとGitHubのNotificationsページを開きます。

### 備考
1. Notificationsページへのチェックはバックグラウンドで実行されます。
1. ブラウザでGitHubのNotificationsページを開いておく必要はありません。
1. GitHubのNotificationsページを開いていない場合、デスクトップ通知をクリックすると新しいタブでNotificationsページを開きます。
1. GitHubのNotificationsページを開いている場合、デスクトップ通知をクリックするとNotificationsページを開いているタブをアクティブにします。

### 注意事項
1. GitHubのNotificationsページのデザインが変わった場合、通知がうまくいかない可能性があります。（気付き次第修正します...）
