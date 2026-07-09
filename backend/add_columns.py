import os
from sqlalchemy import create_engine, text

DATABASE_URL="postgresql+psycopg://postgres.uifdfcbvznxlkodubzvs:fQ5sGUn0CFw4AKXN@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE taskflow_task ADD COLUMN IF NOT EXISTS due_time VARCHAR;"))
        conn.execute(text("ALTER TABLE taskflow_task ADD COLUMN IF NOT EXISTS reminder_offset INTEGER DEFAULT 0;"))
        conn.execute(text("ALTER TABLE taskflow_task ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;"))
        conn.commit()
    print("Columns added successfully.")
except Exception as e:
    print(f"Error: {e}")
