#STAGE 1: Builder
FROM node:22.17.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

#Install dependencies
RUN npm ci

COPY . .

RUN npm run build 

#STAGE 2: Runtime
FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

#Rootless
RUN addgroup -S appuser && adduser -S appuser -G appuser

RUN chown -R appuser:appuser /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && chown -R appuser:appuser /var/run/nginx.pid

COPY --from=builder /app/dist /usr/share/nginx/html
RUN chown -R appuser:appuser /usr/share/nginx/html 

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

USER appuser

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
