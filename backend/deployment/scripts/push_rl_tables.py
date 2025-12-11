import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def read_migration_file():
    """Read RL migration SQL from file"""
    with open('services/db/database/migrations/add_rl_tables.sql', 'r') as f:
        return f.read()

def deploy_to_render():
    """Deploy to Render PostgreSQL"""
    try:
        sql = read_migration_file()
        conn = psycopg2.connect(
            host="dpg-ct4aqt5umphs73e3rr8g-a.oregon-postgres.render.com",
            port="5432",
            database="bhiv_hr_db",
            user="bhiv_hr_db_user",
            password=os.getenv('RENDER_DB_PASSWORD', 'your_render_password_here')
        )
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        
        # Verify tables
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'rl_%'")
        tables = cursor.fetchall()
        
        print("RENDER DATABASE - SUCCESS")
        print("RL Tables created:")
        for table in tables:
            print(f"  - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"RENDER DATABASE - FAILED: {e}")
        return False

def deploy_to_local():
    """Deploy to Local PostgreSQL"""
    try:
        sql = read_migration_file()
        conn = psycopg2.connect(
            host="localhost",
            port="5432", 
            database="bhiv_hr",
            user="postgres",
            password="password"
        )
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        
        # Verify tables
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'rl_%'")
        tables = cursor.fetchall()
        
        print("LOCAL DATABASE - SUCCESS")
        print("RL Tables created:")
        for table in tables:
            print(f"  - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"LOCAL DATABASE - FAILED: {e}")
        return False

if __name__ == "__main__":
    print("Deploying RL Tables to Databases...")
    print("=" * 50)
    
    render_success = deploy_to_render()
    local_success = deploy_to_local()
    
    print("\n" + "=" * 50)
    print("DEPLOYMENT SUMMARY:")
    print(f"Render: {'SUCCESS' if render_success else 'FAILED'}")
    print(f"Local:  {'SUCCESS' if local_success else 'FAILED'}")
    
    if render_success or local_success:
        print("\nRL + Feedback Agent integration ready!")
        print("\nTables created:")
        print("  - rl_predictions")
        print("  - rl_feedback")
        print("  - rl_model_performance")
        print("  - rl_training_data")