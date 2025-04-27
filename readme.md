![nodejs-crm5.png](https://github.com/kkamara/useful/blob/main/nodejs-crm5.png?raw=true)

![nodejs-crm2.png](https://github.com/kkamara/useful/blob/main/nodejs-crm2.png?raw=true)

![nodejs-crm.png](https://github.com/kkamara/useful/blob/main/nodejs-crm.png?raw=true)

![nodejs-reactjs-boilerplate2.png](https://github.com/kkamara/useful/blob/main/nodejs-reactjs-boilerplate2.png?raw=true)

# nodejs-reactjs-boilerplate

(2021) NodeJS, MySQL, Redis, ReactJS 16.

Supported databases: MySQL, PostgreSQL, SQLite, MariaDB.

* [Using Postman?](#postman)

* [Important Note](#important-note)

* [Installation](#installation)

* [Usage](#usage)

* [Using Docker?](#using-docker)

* [To run API tests](#to-run-api-tests)

<a name="postman"></a>
## Using Postman?

[Get Postman HTTP client](https://www.postman.com/).

[Postman API Collection for Wagers Service](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/nodejs-reactjs-boilerplate.postman_collection.json).

[Postman API Environment for Wagers Service](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/nodejs-reactjs-boilerplate.postman_environment.json).

## Important Note

You should remove `config.json` from version-control because all database credentials are stored there.

For database usage in pipelines, I recommend creating a `testing_config.json` and adding database commands to `package.json`, like `migrate:test` and `seed:test`.

## Installation

* [NodeJS](https://nodejs.org/en/).

```bash
# Create our environment file.
cp .env.example .env
# Update values in .env file like port, timezone, and app name.
# Install our app dependencies.
npm install --global yarn
yarn install
# Before running the next command:
# Update your database details in config.json
yarn migrate
yarn seed
```

You can add Sequelize CLI-args for use with this project.

```bash
export SEQUELIZE_ARGS="--config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'"
# Example usage:
#   npx sequelize-cli db:migrate $SEQUELIZE_ARGS
```

#### Frontend Installation

```bash
cd frontend
yarn install
yarn build
```

#### Sequelize tutorial

See [package.json](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/package.json) for helpful commands related to using the database.

```json
...
"migrate": "npx sequelize-cli db:migrate --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'",
"migrate:undo": "npx sequelize-cli db:migrate:undo --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'",
"migrate:undo:all": "cross-env NODE_ENV=development npx sequelize-cli db:migrate:undo:all --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'",
"seed": "npx sequelize-cli db:seed:all --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'",
"seed:undo:all": "npx sequelize-cli db:seed:undo --config='./config.json' --models-path='src/models' --migrations-path='src/migrations' --seeders-path='src/seeders'"
...
```

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

## Usage

```bash
yarn start # Runs Start-script `yarn node src/app.js`
# Serves app to http://localhost:3000.
# Serves API to http://localhost:3000/api/v1.
#   Example API route: http://localhost:3000/api/health.
```

#### Reload server on project files change

```bash
yarn dev
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
