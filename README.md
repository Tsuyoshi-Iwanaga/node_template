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

```
npx sequelize-cli migration:generate --name Users
```

```
npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string
```

```
docker-compose exec app npx sequelize-cli db:migrate
```

```
docker-compose exec app npx sequelize-cli db:migrate:undo
docker-compose exec app npx sequelize-cli db:migrate:all
```

## シーディング

```
npx sequelize-cli seed:generate --name test-users
```

```
docker-compose exec app npx sequelize-cli db:seed:all
```