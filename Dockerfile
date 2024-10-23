#######################
## Development Stage ##
#######################
FROM node:20 AS development
RUN npm install -g pnpm

WORKDIR /usr/app

COPY --chown=node:node package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install

COPY --chown=node:node . .

USER node

################################
## Build for Production Stage ##
################################
FROM node:20 AS build
RUN npm install -g pnpm

WORKDIR /usr/app

COPY --chown=node:node package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install

COPY --chown=node:node . .

RUN pnpm build

RUN pnpm prune --prod

USER node

######################
## Prodcution Stage ##
######################
FROM node:20-alpine AS production

WORKDIR /usr/app

COPY --from=build --chown=node:node /usr/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/app/dist ./dist

USER node

CMD ["node", "dist/main"]
