# STAGE 1: Build dependencies & Prisma
FROM node:20-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

# STAGE 2: Runtime
FROM node:20-bullseye-slim AS production

RUN apt-get update && apt-get install -y libssl1.1

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
