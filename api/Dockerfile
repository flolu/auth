FROM node:14-alpine

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY api api/
COPY shared shared/

RUN yarn install --frozen-lockfile

EXPOSE 3000
CMD ["yarn", "run", "ts-node", "--project", "api/tsconfig.json", "-r", "tsconfig-paths/register", "--transpile-only", "api"]