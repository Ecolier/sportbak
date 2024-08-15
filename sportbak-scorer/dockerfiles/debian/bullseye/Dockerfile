# FIRST STEP
FROM node:14-bullseye as builder

WORKDIR /usr/src/app

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY . .
RUN rm package-lock.json yarn.lock

# install dependencies
RUN npm install

# needed to build
RUN npm install typescript

# build application
RUN yarn run build

# remove development dependencies
#RUN npm prune --production

# run node prune
#RUN /usr/local/bin/node-prune

# remove unused dependencies
RUN rm -rf node_modules/rxjs/src/ \
    rm -rf node_modules/rxjs/bundles/ \
    rm -rf node_modules/rxjs/_esm5/ \
    rm -rf node_modules/rxjs/_esm2015/ \
    rm -rf node_modules/swagger-ui-dist/*.map \
    rm -rf node_modules/couchbase/src/ 

# fix 'sharp' module pb
RUN npm install --ignore-scripts=false sharp

# fix 'cancas' module pb
#RUN npm rebuild --build-from-source canvas

# fix pb
#RUN npm install moment

FROM node:14-bullseye

ENV OS=debian
ENV OS_VERSION=bullseye

WORKDIR /usr/src/app

RUN sed -i -e's/ main/ main contrib non-free/g' /etc/apt/sources.list

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    apt-get install -y ffmpeg i965-va-driver-shaders intel-media-va-driver-non-free libgstreamer-plugins-base1.0-dev && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get purge  --auto-remove && \
    apt-get clean

# copy from build image
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY ./assets /assets

EXPOSE 8081

ENV TZ Europe/Paris

ENTRYPOINT ["yarn"]
