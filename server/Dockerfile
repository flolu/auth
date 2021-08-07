FROM node:14-alpine

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY server server/
COPY shared shared/

RUN yarn install --frozen-lockfile

EXPOSE 3000
CMD ["yarn", "run", "ts-node", "--project", "server/tsconfig.json", "-r", "tsconfig-paths/register", "--transpile-only", "server"]