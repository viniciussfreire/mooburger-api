#######################
## Development Stage ##
#######################
FROM node:20 AS development
RUN npm install -g pnpm
RUN pnpm install -g @nestjs/cli

WORKDIR /usr/app

COPY --chown=node:node package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install

COPY --chown=node:node . .

USER node

################################
## Build for Prodcution Stage ##
################################
FROM node:20 AS build
RUN --chown=node:node npm install -g pnpm
RUN --chown=node:node pnpm install -g @nestjs/cli

WORKDIR /usr/app

COPY --chown=node:node package.json pnpm-lock.yaml .npmrc ./

ENV NODE_ENV Prodcution

RUN pnpm install

COPY --chown=node:node . .

RUN pnpm build

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
