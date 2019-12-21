# vuejs-mastodon-pet2

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# mastodonのAPI
- [ローカル、ホームなど取得](https://docs.joinmastodon.org/methods/timelines)
- [ダイレクトメッセージ](https://docs.joinmastodon.org/methods/timelines/conversations)

# mastodonでテスト用ユーザ追加
- mastodonのフォルダに移動して下記。（パスワードは作成後表示されるのでメモる）

```sh
bin/tootctl accounts create user01 --email user01@example.com --confirmed
```
