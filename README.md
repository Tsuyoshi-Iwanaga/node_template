# node_template
Docker + Expressのテンプレート

## 本番構築時

まずNode.jsをインストール

npmのモジュールをインストール

```
npm install --production 
```

コンテナを起動

```
docker-compose up -d
```

## マイグレーション

Usersのマイグレーションを作成する

```
npx sequelize-cli migration:generate --name Users
```

Usersモデルを作成する(こちらは自動的にマイグレーションファイルも生成される)

```
npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string
```

マイグレーションを実行する

```
npx sequelize-cli db:migrate
```

マイグレーションを巻き戻す

```
sequelize-cli db:migrate:undo
```

## シーディング

```
npx sequelize-cli seed:generate --name test-users
```

```
npx sequelize-cli db:seed:all
```