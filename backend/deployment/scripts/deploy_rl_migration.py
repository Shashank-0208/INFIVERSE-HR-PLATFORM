import psycopg2
import os
from datetime import datetime

# Database configurations
LOCAL_DB_CONFIG = {
    'host': 'localhost',
    'port': '5432',
    'database': 'bhiv_hr',
    'user': 'postgres',
    'password': 'password'
}

RENDER_DB_CONFIG = {
    'host': 'dpg-ct4aqt5umphs73e3rr8g-a.oregon-postgres.render.com',
    'port': '5432',
    'database': 'bhiv_hr_db',
    'user': 'bhiv_hr_db_user',
    'password': os.getenv('RENDER_DB_PASSWORD', 'your_render_password')
}

def read_migration_file():
    """Read the RL migration SQL file"""
    with open('services/database/migrations/add_rl_tables.sql', 'r') as f:
        return f.read()

def deploy_to_database(db_config, db_name):
    """Deploy RL migration to specified database"""
    try:
        print(f"Connecting to {db_name} database...")
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        
        # Read and execute migration
        migration_sql = read_migration_file()
        cursor.execute(migration_sql)
        conn.commit()
        
        print(f"RL tables successfully deployed to {db_name}")
        
        # Verify tables were created
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name LIKE 'rl_%'
        """)
        rl_tables = cursor.fetchall()
        
        print(f"RL Tables created in {db_name}:")
        for table in rl_tables:
            print(f"   - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error deploying to {db_name}: {str(e)}")
        return False

def main():
    """Deploy RL migration to both databases"""
    print("BHIV HR Platform - RL Tables Migration Deployment")
    print("=" * 60)
    
    # Deploy to local database
    print("\n1. Deploying to LOCAL database...")
    local_success = deploy_to_database(LOCAL_DB_CONFIG, "LOCAL")
    
    # Deploy to Render database
    print("\n2. Deploying to RENDER database...")
    render_success = deploy_to_database(RENDER_DB_CONFIG, "RENDER")
    
    # Summary
    print("\n" + "=" * 60)
    print("DEPLOYMENT SUMMARY:")
    print(f"   Local Database:  {'SUCCESS' if local_success else 'FAILED'}")
    print(f"   Render Database: {'SUCCESS' if render_success else 'FAILED'}")
    
    if local_success and render_success:
        print("\nRL + Feedback Agent integration completed successfully!")
        print("   - 4 RL tables deployed to both databases")
        print("   - Ready for LangGraph service testing")
    else:
        print("\nSome deployments failed. Check error messages above.")

if __name__ == "__main__":
    main()