FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY client/package.json client/yarn.lock client/
WORKDIR /app/client
RUN yarn install --frozen-lockfile

FROM node:alpine AS builder
WORKDIR /app
COPY shared ./shared
COPY client ./client
COPY --from=deps /app/client/node_modules ./client/node_modules
WORKDIR /app/client
RUN yarn next build

FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/client/.env.production ./client/.env.production
COPY --from=builder /app/client/next.config.js ./client/
COPY --from=builder /app/client/public ./client/public
COPY --from=builder /app/client/.next ./client/.next
COPY --from=builder /app/client/node_modules ./client/node_modules
COPY --from=builder /app/shared ./
WORKDIR /app/client
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/client/.next
USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]