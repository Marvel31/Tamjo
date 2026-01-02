"""SQLite migration helper for Tamjo

Creates a timestamped backup of `database/tamjo.db`, then recreates the
`birds` table with the new schema (nullable `location_id`, optional
`ebird_species_code`) and copies existing data across. Recreates indexes
and preserves `id` values.

Usage:
    python scripts/migrate_tamjo_db.py [path/to/tamjo.db]

Be sure to stop the app while running this.
"""
import sqlite3
import shutil
import os
import sys
from datetime import datetime


DEFAULT_DB = os.path.join(os.path.dirname(__file__), '..', 'database', 'tamjo.db')


def backup_db(db_path):
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{db_path}.{ts}.bak"
    shutil.copy2(db_path, backup_path)
    print(f"Backup created: {backup_path}")
    return backup_path


def migrate(db_path):
    if not os.path.exists(db_path):
        print(f"Database not found: {db_path}")
        return 1

    backup_db(db_path)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    try:
        # Disable foreign keys during schema change
        cur.execute('PRAGMA foreign_keys = OFF;')

        # Create new table with desired schema
        cur.execute('''
        CREATE TABLE IF NOT EXISTS birds_new (
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

        # Copy existing data into new table (preserve ids)
        cur.execute('''
        INSERT INTO birds_new (id, name, scientific_name, location_id, ebird_species_code, ebird_url, image_url, created_at)
        SELECT id, name, scientific_name, location_id, ebird_species_code, ebird_url, image_url, created_at FROM birds
        ''')

        # Drop old table and rename new one
        cur.execute('DROP TABLE birds')
        cur.execute('ALTER TABLE birds_new RENAME TO birds')

        # Recreate indexes used by the app
        cur.execute('CREATE INDEX IF NOT EXISTS idx_birds_location ON birds(location_id)')
        cur.execute('CREATE INDEX IF NOT EXISTS idx_birds_ebird_code ON birds(ebird_species_code)')

        conn.commit()

        # Ensure sqlite_sequence is up-to-date for AUTOINCREMENT
        cur.execute("SELECT MAX(id) FROM birds")
        max_id = cur.fetchone()[0] or 0
        cur.execute("UPDATE sqlite_sequence SET seq = ? WHERE name = 'birds'", (max_id,))
        conn.commit()

        # Optionally VACUUM to rebuild the DB file
        print("Migration applied. Running VACUUM to rebuild the database file (this may take a moment)...")
        cur.execute('VACUUM')
        conn.commit()

        print("Migration completed successfully.")
        return 0

    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
        return 2
    finally:
        cur.execute('PRAGMA foreign_keys = ON;')
        conn.close()


if __name__ == '__main__':
    db = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(DEFAULT_DB)
    sys.exit(migrate(db))
