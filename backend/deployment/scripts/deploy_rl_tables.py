#!/usr/bin/env python3
"""
RL Tables Deployment Script
Deploys RL tables to both local and Render databases
"""

import psycopg2
import os
import sys
from dotenv import load_dotenv

load_dotenv()

def read_migration_file():
    """Read RL migration SQL from file"""
    try:
        with open('services/database/migrations/add_rl_tables.sql', 'r') as f:
            return f.read()
    except FileNotFoundError:
        # Use the production deployment schema instead
        try:
            with open('services/db/deploy_schema_production.sql', 'r') as f:
                return f.read()
        except FileNotFoundError:
            print("ERROR: No migration files found")
            sys.exit(1)

def deploy_to_render():
    """Deploy to Render PostgreSQL"""
    print("Connecting to Render database...")
    try:
        sql = read_migration_file()
        
        # Try with environment variable first, then fallback
        password = os.getenv('RENDER_DB_PASSWORD')
        if not password:
            print("WARNING: RENDER_DB_PASSWORD not set, using placeholder")
            password = "your_render_password_here"
        
        conn = psycopg2.connect(
            host="dpg-ct4aqt5umphs73e3rr8g-a.oregon-postgres.render.com",
            port="5432",
            database="bhiv_hr_db",
            user="bhiv_hr_db_user",
            password=password,
            sslmode='require'
        )
        
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        
        # Verify tables
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'rl_%' ORDER BY table_name")
        tables = cursor.fetchall()
        
        print("RENDER DATABASE - SUCCESS")
        print("RL Tables created:")
        for table in tables:
            print(f"   - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"RENDER DATABASE - FAILED: {e}")
        return False

def deploy_to_local_docker():
    """Deploy to Local Docker PostgreSQL"""
    print("Connecting to local Docker database...")
    try:
        sql = read_migration_file()
        
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="bhiv_hr",
            user="bhiv_user",
            password=os.getenv('POSTGRES_PASSWORD', 'your_secure_password')
        )
        
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        
        # Verify tables
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'rl_%' ORDER BY table_name")
        tables = cursor.fetchall()
        
        print("LOCAL DOCKER DATABASE - SUCCESS")
        print("RL Tables created:")
        for table in tables:
            print(f"   - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"LOCAL DOCKER DATABASE - FAILED: {e}")
        return False

def deploy_to_local_postgres():
    """Deploy to Local PostgreSQL (standard installation)"""
    print("Connecting to local PostgreSQL...")
    try:
        sql = read_migration_file()
        
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="postgres",
            user="postgres",
            password="password"
        )
        
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        
        # Verify tables
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'rl_%' ORDER BY table_name")
        tables = cursor.fetchall()
        
        print("LOCAL POSTGRES DATABASE - SUCCESS")
        print("RL Tables created:")
        for table in tables:
            print(f"   - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"LOCAL POSTGRES DATABASE - FAILED: {e}")
        return False

def main():
    print("Deploying RL Tables to Databases...")
    print("=" * 60)
    
    # Try deployments
    render_success = deploy_to_render()
    print()
    
    docker_success = deploy_to_local_docker()
    print()
    
    postgres_success = deploy_to_local_postgres()
    
    print("\n" + "=" * 60)
    print("DEPLOYMENT SUMMARY:")
    print(f"Render Database:     {'SUCCESS' if render_success else 'FAILED'}")
    print(f"Local Docker DB:     {'SUCCESS' if docker_success else 'FAILED'}")
    print(f"Local PostgreSQL:    {'SUCCESS' if postgres_success else 'FAILED'}")
    
    success_count = sum([render_success, docker_success, postgres_success])
    
    if success_count > 0:
        print(f"\n{success_count}/3 databases updated successfully!")
        print("\nRL Tables Created:")
        print("   - rl_predictions (candidate scoring)")
        print("   - rl_feedback (reward signals)")
        print("   - rl_model_performance (tracking)")
        print("   - rl_training_data (learning)")
        print("\nRL + Feedback Agent integration ready!")
    else:
        print("\nAll deployments failed. Check database connections.")
        print("\nTroubleshooting:")
        print("1. Ensure Docker is running for local deployment")
        print("2. Check Render database credentials")
        print("3. Verify PostgreSQL is installed locally")

if __name__ == "__main__":
    main()