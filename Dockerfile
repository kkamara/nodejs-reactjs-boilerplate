# syntax=docker/dockerfile:1

FROM node:23

ENV NODE_ENV=local

WORKDIR /app

COPY ["package.json", "yarn.lock*", "./"]

RUN yarn install

COPY . .

CMD ["yarn", "run", "start"]
