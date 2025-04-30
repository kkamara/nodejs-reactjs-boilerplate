![nodejs-crm5.png](https://github.com/kkamara/useful/blob/main/nodejs-crm5.png?raw=true)

![nodejs-crm2.png](https://github.com/kkamara/useful/blob/main/nodejs-crm2.png?raw=true)

![nodejs-crm.png](https://github.com/kkamara/useful/blob/main/nodejs-crm.png?raw=true)

![nodejs-reactjs-boilerplate2.png](https://github.com/kkamara/useful/blob/main/nodejs-reactjs-boilerplate2.png?raw=true)

# nodejs-reactjs-boilerplate

(2021) A NodeJS boilerplate with ReactJS 19 Redux SPA.

* [Using Postman?](#postman)

* [Important Note](#important-note)

* [Installation](#installation)

* [Usage](#usage)

* [Using Docker?](#using-docker)

* [To run API tests](#to-run-api-tests)

* [Contributing](#contributing)

* [License](#license)

<a name="postman"></a>
## Using Postman?

[Get Postman HTTP client](https://www.postman.com).

[Postman API Collection for NodeJS ReactJS Boilerplate](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/nodejs-reactjs-boilerplate.postman_collection.json).

[Postman API Environment for NodeJS ReactJS Boilerplate](https://github.com/kkamara/nodejs-reactjs-boilerplate/blob/main/nodejs-reactjs-boilerplate.postman_environment.json).

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

#### Frontend Installation

```bash
cd frontend
yarn install
yarn build
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

* [Docker](https://docs.docker.com/engine/install/) 
* [Docker Compose](https://docs.docker.com/compose/install/).

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
