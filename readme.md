![nodejs-crm5.png](https://github.com/kkamara/useful/blob/main/nodejs-crm5.png?raw=true)

![nodejs-crm2.png](https://github.com/kkamara/useful/blob/main/nodejs-crm2.png?raw=true)

![nodejs-crm.png](https://github.com/kkamara/useful/blob/main/nodejs-crm.png?raw=true)

![nodejs-reactjs-boilerplate2.png](https://github.com/kkamara/useful/blob/main/nodejs-reactjs-boilerplate2.png?raw=true)

# nodejs-reactjs-boilerplate

(2021) NodeJS, MySQL, Redis, ReactJS 16.

Supported databases: MySQL, PostgreSQL, SQLite, MariaDB.

* [Using Postman?](#postman)

* [Installation](#installation)

* [Usage](#usage)

* [Using Docker?](#using-docker)

* [To run API tests](#to-run-api-tests)

<a name="postman"></a>
## Using Postman?

[Get Postman HTTP client](https://www.postman.com/).

[Postman API Collection for Wagers Service](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/nodejs-reactjs-boilerplate.postman_collection.json).

[Postman API Environment for Wagers Service](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/nodejs-reactjs-boilerplate.postman_environment.json).

## Installation

* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/).

Update `config.json` with details of your database credentials. The core package we use is Sequelize, and that supports the following databases: MySQL, PostgreSQL, SQLite, MariaDB.

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

See [package.json](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/package.json) for helpful commands related to using the database.

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

<a name="using-docker"></a>
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
