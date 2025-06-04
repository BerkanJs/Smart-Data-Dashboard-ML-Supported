# Build aşaması
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Prod için nginx
FROM nginx:stable-alpine

# Build edilmiş dosyaları nginx'e kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# Özel nginx.conf dosyasını doğru yere kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
