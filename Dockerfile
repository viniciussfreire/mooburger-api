#######################
## Development Stage ##
#######################
FROM node:22 AS development
RUN npm install -g pnpm

RUN mkdir -p /usr/app && chown -R node:node /usr/app

WORKDIR /usr/app

COPY --chown=node:node package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install
RUN pnpm prisma generate

COPY --chown=node:node . .

USER node

################################
## Build for Production Stage ##
################################
FROM node:22 AS build
RUN npm install -g pnpm

RUN mkdir -p /usr/app && chown -R node:node /usr/app

WORKDIR /usr/app

COPY --chown=node:node package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install

COPY --chown=node:node . .

RUN pnpm prisma generate
RUN pnpm build

RUN pnpm prune --prod

USER node

######################
## Production Stage ##
######################
FROM node:22-alpine AS production
RUN apk update --no-cache && apk upgrade openssl

RUN mkdir -p /usr/app && chown -R node:node /usr/app

WORKDIR /usr/app

COPY --from=build --chown=node:node /usr/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/app/dist ./dist

RUN chown -R node:node /usr/app

USER node

CMD ["node", "dist/main"]
