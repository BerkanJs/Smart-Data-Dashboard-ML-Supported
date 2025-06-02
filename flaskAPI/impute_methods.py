import pandas as pd
import numpy as np

def handle_imputation(csv_data, method='median', value=None, columns=None):
    try:
        # DataFrame oluştur
        df = pd.DataFrame(csv_data)

        print("Veri Türleri (İlk Okuma):")
        print(df.dtypes)

        # Boşluk olanları NaN ile değiştir
        df.replace(r'^\s*$', np.nan, regex=True, inplace=True)

        # Sayısal sütunlar dışındaki (object) sütunları numeric'e çevirmeyi dene (ama başarısız olursa dokunma)
        for col in df.columns:
            try:
                df[col] = pd.to_numeric(df[col], errors='ignore')
            except:
                continue

        # Tamamen boş olan sütunları sil
        df.dropna(axis=1, how='all', inplace=True)
        print(f"Tamamen NaN veya boş olan sütunlar silindi. Kalan sütunlar: {df.columns.tolist()}")

        # Sayısal ve kategorik sütunları ayır
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()

        df_filled = df.copy()

        # İmputasyon yöntemine göre doldurma işlemleri
        if method == 'median':
            print("Sayısal sütunlar median ile, kategorik sütunlar mod ile dolduruluyor...")
            for col in numeric_cols:
                df_filled[col] = df[col].fillna(df[col].median())
            for col in categorical_cols:
                mode_val = df[col].mode()
                df_filled[col] = df[col].fillna(mode_val[0] if not mode_val.empty else 'Unknown')

        elif method == 'mean':
            print("Sayısal sütunlar ortalama ile, kategorik sütunlar mod ile dolduruluyor...")
            for col in numeric_cols:
                df_filled[col] = df[col].fillna(df[col].mean())
            for col in categorical_cols:
                mode_val = df[col].mode()
                df_filled[col] = df[col].fillna(mode_val[0] if not mode_val.empty else 'Unknown')

        elif method == 'mode':
            print("Kategorik sütunlar mod ile dolduruluyor...")
            for col in categorical_cols:
                mode_val = df[col].mode()
                df_filled[col] = df[col].fillna(mode_val[0] if not mode_val.empty else 'Unknown')
            # Sayısal sütunlar da varsa, onlar için de mode ile doldur
            for col in numeric_cols:
                mode_val = df[col].mode()
                df_filled[col] = df[col].fillna(mode_val[0] if not mode_val.empty else df[col].mean())

        elif method == 'value' and value is not None:
            print(f"Tüm NaN değerler '{value}' ile dolduruluyor...")
            df_filled = df.fillna(value)

        elif method == 'columns' and columns:
            print(f"Belirtilen sütunlar dolduruluyor: {columns}")
            for col in columns:
                if col in df.columns:
                    if pd.api.types.is_numeric_dtype(df[col]):
                        df_filled[col] = df[col].fillna(df[col].median())
                    else:
                        mode_val = df[col].mode()
                        df_filled[col] = df[col].fillna(mode_val[0] if not mode_val.empty else 'Unknown')
        else:
            raise ValueError("Geçersiz imputasyon metodu veya eksik parametre!")

        print("İmputasyon işlemi tamamlandı.")
        return df_filled.to_dict(orient='records')

    except Exception as e:
        print(f"İmputasyon hatası: {e}")
        raise e
