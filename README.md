# node-react-boilerplate [![Run CI](https://github.com/kkamara/node-react-boilerplate/actions/workflows/node.js.yml/badge.svg)](https://github.com/kkamara/node-react-boilerplate/actions/workflows/node.js.yml)

Nodejs, Mysql, Redis, Reactjs.

## Installation

* [Node.js](https://nodejs.org/en/)
* [yarn](https://yarnpkg.com/).

```bash
  cp .env.example .env
  yarn install
```

## To run locally

Have [docker](https://docs.docker.com/engine/install/) & [docker-compose](https://docs.docker.com/compose/install/) installed on your operating system.

```bash
  docker-compose up --build -d
```

## To run browser tests with gui

```bash
  yarn run test
```

View browser test code: [/blob/main/tests/](https://github.com/kkamara/node-react-boilerplate/blob/main/tests/).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[BSD](https://opensource.org/licenses/BSD-3-Clause)
