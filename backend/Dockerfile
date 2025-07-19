# STAGE 1: Builder
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# STAGE 2: Runtime
FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

USER nonroot

COPY --from=builder /app/ ./

CMD ["index.js"]
