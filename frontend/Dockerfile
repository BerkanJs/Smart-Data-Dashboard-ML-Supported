# 1. Node.js base image ile build işlemi
FROM node:18 AS builder

# 2. Çalışma dizini
WORKDIR /app

# 3. package.json dosyalarını kopyala ve bağımlılıkları yükle
COPY package*.json ./
RUN npm install

# 4. Tüm dosyaları kopyala
COPY . .

# 5. Build işlemini yap
RUN npm run build

# 6. Production için nginx image kullan
FROM nginx:stable-alpine

# 7. Build edilmiş dosyaları nginx html klasörüne kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. Özel nginx.conf dosyasını kopyala
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 9. Portu expose et (nginx varsayılan portu 80'dir)
EXPOSE 80

# 10. nginx başlat
CMD ["nginx", "-g", "daemon off;"]
