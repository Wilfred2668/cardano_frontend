"""
SQLite database setup and configuration
"""
import sqlite3
from contextlib import contextmanager
from typing import Generator
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "campaigns.db")

def init_database():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create user_identifiers table to store unique hex per DID
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_identifiers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            did TEXT UNIQUE NOT NULL,
            identifier_from_purchaser TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create campaigns table with all fields
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            campaign_id TEXT UNIQUE NOT NULL,
            did TEXT NOT NULL,
            identifier_from_purchaser TEXT NOT NULL,
            
            -- Campaign details (all fields for display)
            campaign_name TEXT NOT NULL,
            campaign_description TEXT NOT NULL,
            campaign_objective TEXT,
            target_audience TEXT,
            budget REAL,
            duration_days INTEGER,
            start_date TEXT,
            end_date TEXT,
            
            -- Processing fields (sent to external API)
            input_text TEXT NOT NULL,
            
            -- Status tracking
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (did) REFERENCES user_identifiers(did)
        )
    """)
    
    # Create index on DID for faster lookups
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_campaigns_did 
        ON campaigns(did)
    """)
    
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_user_identifiers_did 
        ON user_identifiers(did)
    """)
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DATABASE_PATH}")

@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Initialize database on import
init_database()
