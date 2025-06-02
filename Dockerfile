# Base image: Node ve Python yüklü hafif Alpine
FROM python:3.11-alpine AS base

# Node.js ekle (alpine üzerine)
RUN apk add --no-cache nodejs npm

# Çalışma dizini
WORKDIR /app

# package.json ve package-lock.json kopyala
COPY package*.json ./

# Node bağımlılıkları yükle
RUN npm install

# Python bağımlılıkları için requirements.txt kopyala
COPY requirements.txt .

# Python bağımlılıklarını yükle
RUN pip install --no-cache-dir -r requirements.txt

# React frontend kodlarını kopyala
COPY frontend ./frontend

# React frontend build
RUN cd frontend && npm run build

# Backend kodlarını kopyala
COPY backend ./backend

# Flask API kodlarını kopyala
COPY flaskapi ./flaskapi

# uploads klasörünü oluştur (eğer gerekiyorsa)
RUN mkdir -p /app/backend/uploads

# start.sh scriptini kopyala ve çalıştırılabilir yap
COPY start.sh .
RUN chmod +x start.sh

# 5000 portu dışa aç (backend için)
EXPOSE 5000
# 8000 portu dışa aç (flask için örnek)
EXPOSE 8000

# Container açılırken start.sh çalıştır
CMD ["./start.sh"]
