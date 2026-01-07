FROM alpine:3.17

ENV NODE_VERSION 18.12.1

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN yarn install

COPY . /app

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]