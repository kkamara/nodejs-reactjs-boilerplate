# syntax=docker/dockerfile:1

FROM node:24

ENV NODE_ENV=development

WORKDIR /app

COPY ["package.json", "yarn.lock*", "./"]

RUN yarn install

COPY . .

CMD ["yarn", "run", "dev"]
