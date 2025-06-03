# 1. Node.js resmi imajından başla
FROM node:18

# 2. Çalışma dizinini oluştur ve ayarla
WORKDIR /app

# 3. package.json ve package-lock.json (varsa) kopyala
COPY package*.json ./

# 4. Bağımlılıkları yükle
RUN npm install

# 5. Projedeki tüm dosyaları kopyala
COPY . .

# 6. Projeyi build et (vite build çalıştır)
RUN npm run build

# 7. Production için hafif bir web server (serve, http-server ya da nginx kullanabilirsin)
# Bu örnekte basit ve hızlı kurulum için serve kullanıyoruz.
RUN npm install -g serve

# 8. Container dışına 3000 portunu aç
EXPOSE 3000

# 9. Build edilmiş dosyaları serve ile sun
CMD ["serve", "-s", "dist", "-l", "3000"]
