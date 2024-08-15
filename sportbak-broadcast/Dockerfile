# First stage
FROM node:14-buster as tsc-builder
WORKDIR /usr/src/app

RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y ffmpeg

COPY . .
RUN yarn install && yarn run build

EXPOSE 8080

ENV TZ Europe/Paris


ENTRYPOINT ["yarn"]
