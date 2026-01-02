import sqlite3
import os
from datetime import datetime

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database', 'tamjo.db')

def get_db():
    """데이터베이스 연결 반환"""
    db = sqlite3.connect(DATABASE_PATH)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """데이터베이스 초기화 및 테이블 생성"""
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    
    db = get_db()
    cursor = db.cursor()
    
    # locations 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # birds 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS birds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            scientific_name TEXT,
            location_id INTEGER,
            ebird_species_code TEXT UNIQUE,
            ebird_url TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
        )
    ''')
    
    # 인덱스 생성
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_birds_location ON birds(location_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_birds_ebird_code ON birds(ebird_species_code)')
    
    db.commit()
    db.close()
    print("✓ 데이터베이스 초기화 완료")

if __name__ == '__main__':
    init_db()
