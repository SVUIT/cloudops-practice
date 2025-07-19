#STAGE 1: Builder
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

#Install dependencies
RUN npm ci

COPY . .

RUN npm run build 

#STAGE 2: Runtime
FROM nginx:1.25-alpine

#Rootless
RUN addgroup -S appuser && adduser -S appuser -G appuser

RUN chown -R appuser:appuser /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && chown -R appuser:appuser /var/run/nginx.pid

COPY --from=builder /app/build /usr/share/nginx/html

USER appuser

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
