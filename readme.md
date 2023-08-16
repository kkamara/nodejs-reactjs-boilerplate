![nodejs-crm5.png](https://github.com/kkamara/useful/blob/main/nodejs-crm5.png?raw=true)

![nodejs-crm2.png](https://github.com/kkamara/useful/blob/main/nodejs-crm2.png?raw=true)

![nodejs-crm.png](https://github.com/kkamara/useful/blob/main/nodejs-crm.png?raw=true)

![node-react-boilerplate2.png](https://github.com/kkamara/useful/blob/main/node-react-boilerplate2.png?raw=true)

# nodejs-react-boilerplate

(2021) Nodejs, Mysql, Redis, Reactjs.

Supported databases: mysql, postgres, sqlite, mariadb.

## Installation

* [Node.js](https://nodejs.org/en/)
* [yarn](https://yarnpkg.com/).

```bash
  cp .env.example .env
  yarn install
```

Add sequelize args for use with this project.

```bash
export SEQUELIZE_ARGS="--config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'"
# Example usage:
# npx sequelize-cli init $SEQUELIZE_ARGS
```

##### Sequelize tutorial

```bash
# Docs:
#   https://sequelize.org/docs/v6/other-topics/migrations/
# Running a specific database seeder
npx sequelize-cli db:seed --seed 20230814135938-demo-user.js $SEQUELIZE_ARGS
# Creating a model & migration
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string $SEQUELIZE_ARGS
# Creating a migration
npx sequelize-cli migration:generate --name migration-skeleton $SEQUELIZE_ARGS
# Running migrations
npx sequelize-cli db:migrate $SEQUELIZE_ARGS
# Revert the most recent migration
npx sequelize-cli db:migrate:undo $SEQUELIZE_ARGS
# Revert to a specific migration
npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js $SEQUELIZE_ARGS
# Creating a seed (fake database data) to simulate production environment
npx sequelize-cli seed:generate --name demo-user $SEQUELIZE_ARGS
# Running seeds
npx sequelize-cli db:seed:all $SEQUELIZE_ARGS
# Undo the latest seed
npx sequelize-cli db:seed:undo $SEQUELIZE_ARGS
# Undo all seeds
npx sequelize-cli db:seed:undo:all $SEQUELIZE_ARGS
```

See [package.json](https://github.com/kkamara/nodejs-react-boilerplate/blob/main/package.json) for helpful commands related to using the database.

```json
...
    "migrate": "npx sequelize-cli db:migrate --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'",
    "migrate:undo": "npx sequelize-cli db:migrate:undo --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'",
    "seed": "npx sequelize-cli db:seed:all --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'",
    "seed:undo:all": "npx sequelize-cli db:seed:undo --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'"
...
```

## Usage

##### Run database migrations

```bash
  yarn migrate
```

##### Run database seeders

```bash
  yarn seed
```

##### Run start
```bash
yarn start # Runs Start-script `yarn node src/app.js`
# Serves app to http://localhost:3000/.
# Serves api to http://localhost:3000/api/v1.
#   Example api route: http://localhost:3000/api/v1/test.
```

###### Reload server on project files change

```bash
yarn dev # Runs Dev-script `nodemon src/app.js`
# We can also `APP_ENV=development nodemon src/app.js`.
```


## Using docker?

* [docker](https://docs.docker.com/engine/install/) 
* [docker-compose](https://docs.docker.com/compose/install/).

```bash
docker-compose up --build -d
```

## To run api tests

```bash
yarn test
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[BSD](https://opensource.org/licenses/BSD-3-Clause)
