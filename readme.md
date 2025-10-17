![nodejs-reactjs-boilerplate.png](https://github.com/kkamara/useful/blob/main/nodejs-reactjs-boilerplate.png?raw=true)

![nodejs-reactjs-boilerplate2.png](https://github.com/kkamara/useful/blob/main/nodejs-reactjs-boilerplate2.png?raw=true)

# nodejs-reactjs-boilerplate

(22-Jun-2021) An MVC NodeJS boilerplate with ReactJS 19 Redux SPA.

* [Using Postman?](#postman)

* [Important Note](#important-note)

* [Installation](#installation)

* [Usage](#usage)

* [Using Docker?](#using-docker)

* [Mail Server With Docker](#mail-server-with-docker)

* [API Tests](#api-tests)

* [Misc.](#misc)

* [Contributing](#contributing)

* [License](#license)

<a name="postman"></a>
## Using Postman?

[Get Postman HTTP client](https://www.postman.com).

[Postman API Collection for NodeJS ReactJS Boilerplate](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/nodejs-reactjs-boilerplate.postman_collection.json).

[Postman API Environment for NodeJS ReactJS Boilerplate](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/nodejs-reactjs-boilerplate.postman_environment.json).

## Important Note

You should remove `config.json` from version-control because all database credentials are stored there.

For database usage in pipelines, I recommend creating a `testing_config.json` and adding database commands to `package.json`, like `migrate:test` and `seed:all:test`.

## Installation

* [NodeJS](https://nodejs.org/en/).

```bash
# Create our environment file.
# Update values in .env file like port and timezone.
# Not using Docker?
cp .env.example .env
# Using Docker?
cp .env.docker .env
# Install Yarn globally.
npm install --global yarn
# Install our app dependencies.
yarn
# Before running the next command:
# Update your database details in config.json
yarn migrate
yarn seed:all
```

#### Frontend Installation

```bash
cd frontend
yarn
yarn build
```

#### Sequelize tutorial

See [package.json](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/package.json) for helpful commands related to using the database.

```bash
# Docs:
#   https://sequelize.org/docs/v6/other-topics/migrations/
# Running a specific database seeder
NODE_ENV=development npx sequelize-cli db:seed --seed 20230814135938-demo-user.js
# Creating a model & migration
NODE_ENV=development npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
# Creating a migration
NODE_ENV=development npx sequelize-cli migration:generate --name migration-skeleton
# Running migrations
NODE_ENV=development npx sequelize-cli db:migrate
# Revert the most recent migration
NODE_ENV=development npx sequelize-cli db:migrate:undo
# Revert to a specific migration
NODE_ENV=development npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
# Creating a seed (fake database data) to simulate production environment
NODE_ENV=development npx sequelize-cli seed:generate --name demo-user
# Running seeds
NODE_ENV=development npx sequelize-cli db:seed:all
# Undo the latest seed
NODE_ENV=development npx sequelize-cli db:seed:undo
# Undo all seeds
NODE_ENV=development npx sequelize-cli db:seed:undo:all
```

## Usage

```bash
yarn start # Runs Start-script `yarn node src/app.js`
# Serves app to http://localhost:8000 .
# Serves API to http://localhost:8000/api/v1 .
#   Example API route: http://localhost:8000/api/health .
```

#### Reload server on project files change

```bash
yarn dev
```

#### Reload server and frontend app on project files change

```bash
yarn dev:frontend
```

<a name="using-docker"></a>
## Using docker?

* [Docker](https://docs.docker.com/engine/install/) 
* [Docker Compose](https://docs.docker.com/compose/install/).

```bash
cp .env.docker .env
docker-compose up --build -d
```

## Mail Server With Docker

![docker-mailhog.png](https://raw.githubusercontent.com/kkamara/useful/main/docker-mailhog.png)

Mail environment credentials are at [.env.docker](https://raw.githubusercontent.com/kkamara/nodejs-reactjs-boilerplate/main/.env.docker).

The [Mailhog](https://github.com/mailhog/MailHog) Docker image runs at `http://localhost:8025`in this app.

## API Tests

```bash
NODE_ENV=test yarn test
```

## Misc.

* [See NodeJS ReactJS Boilerplate](https://github.com/kkamara/nodejs-reactjs-boilerplate)

* [See ReactJS Native Mobile App Boilerplate](https://github.com/kkamara/ReactJSNativeMobileAppBoilerplate)

* [See MRVL Desktop](https://github.com/kkamara/mrvl-desktop)

* [See MRVL Web](https://github.com/kkamara/mrvl-web)

* [See NodeJS Docker Skeleton](https://github.com/kkamara/nodejs-docker-skeleton)

* [See NodeJS Scraper](https://github.com/kkamara/nodejs-scraper).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[BSD](https://opensource.org/licenses/BSD-3-Clause)
