import sqlite3
import json
from datetime import datetime
from app.config import DATABASE_PATH

def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Processes table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS processes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        country TEXT,
        state TEXT,
        city TEXT,
        authority TEXT,
        status TEXT DEFAULT 'active',
        completion_percentage INTEGER DEFAULT 0,
        estimated_time TEXT,
        created_at TEXT,
        updated_at TEXT
    );
    """)

    # Steps table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS steps (
        id TEXT PRIMARY KEY,
        process_id TEXT NOT NULL,
        step_order INTEGER NOT NULL,
        title TEXT NOT NULL,
        what TEXT NOT NULL,
        why TEXT NOT NULL,
        how TEXT NOT NULL,
        what_i_need TEXT,  -- JSON list of documents/items
        where_label TEXT,
        where_url TEXT,
        who_authority TEXT,
        when_timeline TEXT,
        source_id TEXT,
        status TEXT DEFAULT 'pending',  -- 'pending', 'in_progress', 'completed', 'skipped'
        is_fast_path_skippable BOOLEAN DEFAULT 0,
        FOREIGN KEY (process_id) REFERENCES processes (id)
    );
    """)

    # Sources table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        process_id TEXT NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        source_type TEXT NOT NULL, -- 'official', 'trusted', 'supporting'
        snippet TEXT,
        date_published TEXT,
        is_verified BOOLEAN DEFAULT 1,
        FOREIGN KEY (process_id) REFERENCES processes (id)
    );
    """)

    # Contacts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        process_id TEXT NOT NULL,
        organization TEXT NOT NULL,
        department TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        map_url TEXT,
        working_hours TEXT,
        FOREIGN KEY (process_id) REFERENCES processes (id)
    );
    """)

    # Document Requirements table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        process_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        is_required BOOLEAN DEFAULT 1,
        is_held BOOLEAN DEFAULT 0,
        FOREIGN KEY (process_id) REFERENCES processes (id)
    );
    """)

    # Search Cache table to avoid re-querying SerpApi and save credits
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS search_cache (
        query_hash TEXT PRIMARY KEY,
        query TEXT NOT NULL,
        engine TEXT NOT NULL,
        results_json TEXT NOT NULL,
        cached_at TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()
