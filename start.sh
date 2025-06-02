#!/bin/sh


cd /app/flaskapi
export FLASK_APP=app.py
export FLASK_ENV=production
flask run --host=0.0.0.0 --port=8000 &


cd /app/backend


rm -rf public
cp -r ../frontend/dist public

node server.js
