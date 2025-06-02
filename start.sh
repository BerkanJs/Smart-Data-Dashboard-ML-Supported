#!/bin/sh

# Flask API klasörüne git ve flask başlat
cd /app/flaskAPI
export FLASK_APP=app.py
export FLASK_ENV=production
flask run --host=0.0.0.0 --port=8000 &

# Backend klasörüne geç
cd /app/backend

# frontend build çıktılarını backend içinde public klasörüne kopyala
rm -rf public
cp -r ../frontend/dist public

# Node.js server başlat
node server.js
