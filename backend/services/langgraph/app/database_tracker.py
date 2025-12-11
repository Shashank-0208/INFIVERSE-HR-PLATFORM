"""Database-backed workflow tracker with fallback support"""
import psycopg2
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging
import sys
import os

# Add parent directory to path for config import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

logger = logging.getLogger(__name__)

class DatabaseWorkflowTracker:
    def __init__(self):
        self.connection = None
        self.fallback_storage = {}  # In-memory fallback
        self._connect()
    
    def _connect(self):
        """Connect to database with fallback to in-memory"""
        try:
            self.connection = psycopg2.connect(
                settings.database_url,
                cursor_factory=RealDictCursor
            )
            logger.info("✅ Database connection established for workflow tracking")
        except Exception as e:
            logger.warning(f"⚠️ Database connection failed, using in-memory fallback: {str(e)}")
            self.connection = None
    
    def _execute_query(self, query: str, params: tuple = None, fetch: bool = False):
        """Execute query with fallback handling"""
        if not self.connection:
            return None
        
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                if fetch:
                    return cursor.fetchall()
                self.connection.commit()
                return True
        except Exception as e:
            logger.error(f"❌ Database query failed: {str(e)}")
            self.connection.rollback()
            return None
    
    def create_workflow(self, workflow_id: str, workflow_type: str = "candidate_application", 
                       candidate_id: int = None, job_id: int = None, client_id: str = None,
                       input_data: Dict = None):
        """Create new workflow with database + fallback"""
        workflow_data = {
            "workflow_id": workflow_id,
            "workflow_type": workflow_type,
            "status": "running",
            "candidate_id": candidate_id,
            "job_id": job_id,
            "client_id": client_id,
            "progress_percentage": 0,
            "current_step": "initializing",
            "total_steps": 5,
            "input_data": input_data or {},
            "output_data": {},
            "started_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        # Try database first
        query = """
        INSERT INTO workflows (workflow_id, workflow_type, status, candidate_id, job_id, client_id,
                             progress_percentage, current_step, total_steps, input_data, output_data)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            workflow_id, workflow_type, "running", candidate_id, job_id, client_id,
            0, "initializing", 5, json.dumps(input_data or {}), json.dumps({})
        )
        
        if self._execute_query(query, params):
            logger.info(f"✅ Workflow {workflow_id} created in database")
        else:
            # Fallback to in-memory
            self.fallback_storage[workflow_id] = workflow_data
            logger.info(f"⚠️ Workflow {workflow_id} created in fallback storage")
    
    def update_workflow(self, workflow_id: str, **kwargs):
        """Update workflow with detailed progress tracking"""
        # Prepare update data
        update_fields = []
        update_values = []
        
        for key, value in kwargs.items():
            if key in ['status', 'progress_percentage', 'current_step', 'total_steps', 
                      'error_message', 'completed_at']:
                update_fields.append(f"{key} = %s")
                update_values.append(value)
            elif key in ['output_data', 'input_data']:
                update_fields.append(f"{key} = %s")
                update_values.append(json.dumps(value) if isinstance(value, dict) else value)
        
        if not update_fields:
            return
        
        # Always update updated_at
        update_fields.append("updated_at = CURRENT_TIMESTAMP")
        update_values.append(workflow_id)
        
        # Try database first
        query = f"""
        UPDATE workflows 
        SET {', '.join(update_fields)}
        WHERE workflow_id = %s
        """
        
        if self._execute_query(query, tuple(update_values)):
            logger.debug(f"✅ Workflow {workflow_id} updated in database")
        else:
            # Fallback to in-memory
            if workflow_id in self.fallback_storage:
                self.fallback_storage[workflow_id].update(kwargs)
                self.fallback_storage[workflow_id]["updated_at"] = datetime.now().isoformat()
                logger.debug(f"⚠️ Workflow {workflow_id} updated in fallback storage")
    
    def get_workflow_status(self, workflow_id: str) -> Optional[Dict]:
        """Get workflow status from database or fallback"""
        # Try database first
        query = """
        SELECT workflow_id, workflow_type, status, candidate_id, job_id, client_id,
               progress_percentage, current_step, total_steps, input_data, output_data,
               error_message, started_at, completed_at, updated_at
        FROM workflows WHERE workflow_id = %s
        """
        
        result = self._execute_query(query, (workflow_id,), fetch=True)
        if result and len(result) > 0:
            row = dict(result[0])
            # Parse JSON fields
            if row.get('input_data'):
                try:
                    row['input_data'] = json.loads(row['input_data'])
                except:
                    row['input_data'] = {}
            if row.get('output_data'):
                try:
                    row['output_data'] = json.loads(row['output_data'])
                except:
                    row['output_data'] = {}
            return row
        
        # Fallback to in-memory
        return self.fallback_storage.get(workflow_id)
    
    def list_workflows(self, limit: int = 50) -> List[Dict]:
        """List workflows from database or fallback"""
        # Try database first
        query = """
        SELECT workflow_id, workflow_type, status, candidate_id, job_id, client_id,
               progress_percentage, current_step, total_steps, started_at, completed_at, updated_at
        FROM workflows 
        ORDER BY started_at DESC 
        LIMIT %s
        """
        
        result = self._execute_query(query, (limit,), fetch=True)
        if result:
            workflows = []
            for row in result:
                workflow = dict(row)
                workflows.append(workflow)
            return workflows
        
        # Fallback to in-memory
        workflows = list(self.fallback_storage.values())
        return sorted(workflows, key=lambda x: x.get('started_at', ''), reverse=True)[:limit]
    
    def get_active_workflows(self) -> List[Dict]:
        """Get all running workflows"""
        # Try database first
        query = """
        SELECT workflow_id, workflow_type, status, progress_percentage, current_step, started_at
        FROM workflows 
        WHERE status IN ('running', 'processing')
        ORDER BY started_at DESC
        """
        
        result = self._execute_query(query, fetch=True)
        if result:
            return [dict(row) for row in result]
        
        # Fallback to in-memory
        return [w for w in self.fallback_storage.values() 
                if w.get('status') in ['running', 'processing']]
    
    def complete_workflow(self, workflow_id: str, final_status: str = "completed", 
                         output_data: Dict = None, error_message: str = None):
        """Mark workflow as completed with final data"""
        update_data = {
            "status": final_status,
            "progress_percentage": 100 if final_status == "completed" else 0,
            "current_step": "finished" if final_status == "completed" else "failed",
            "completed_at": datetime.now().isoformat()
        }
        
        if output_data:
            update_data["output_data"] = output_data
        if error_message:
            update_data["error_message"] = error_message
        
        self.update_workflow(workflow_id, **update_data)
        logger.info(f"✅ Workflow {workflow_id} completed with status: {final_status}")
    
    def cleanup_old_workflows(self, days: int = 30):
        """Clean up old completed workflows"""
        query = """
        DELETE FROM workflows 
        WHERE status IN ('completed', 'failed', 'cancelled') 
        AND started_at < NOW() - INTERVAL '%s days'
        """
        
        if self._execute_query(query, (days,)):
            logger.info(f"✅ Cleaned up workflows older than {days} days")

# Global tracker instance
tracker = DatabaseWorkflowTracker()