FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    gfortran \
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip setuptools wheel

COPY requirements.txt .

# numpy'yi önce tek başına kur
RUN pip install --no-cache-dir numpy==1.24.4

# sonra geri kalan paketleri kur (requirements.txt içinden numpy kaldırılmış olmalı)
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
