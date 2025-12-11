import psycopg2
import psycopg2.extras
import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)

class PostgreSQLAdapter:
    """PostgreSQL adapter for RL data operations"""
    
    def __init__(self):
        self.connection_params = self._get_connection_params()
    
    def _get_connection_params(self) -> Dict[str, str]:
        """Get database connection parameters"""
        database_url = os.getenv('DATABASE_URL')
        if database_url:
            # Parse DATABASE_URL for production
            return {'dsn': database_url}
        else:
            # Local development parameters
            return {
                'host': os.getenv('DB_HOST', 'localhost'),
                'port': os.getenv('DB_PORT', '5432'),
                'database': os.getenv('DB_NAME', 'bhiv_hr'),
                'user': os.getenv('DB_USER', 'bhiv_user'),
                'password': os.getenv('DB_PASSWORD', 'your_secure_password')
            }
    
    @contextmanager
    def get_connection(self):
        """Get database connection with context manager"""
        conn = None
        try:
            if 'dsn' in self.connection_params:
                conn = psycopg2.connect(self.connection_params['dsn'])
            else:
                conn = psycopg2.connect(**self.connection_params)
            conn.autocommit = False
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database connection error: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    def store_rl_prediction(self, prediction_data: Dict) -> Optional[int]:
        """Store RL prediction in database"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO rl_predictions 
                    (candidate_id, job_id, rl_score, confidence_level, decision_type, features, model_version)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    prediction_data['candidate_id'],
                    prediction_data['job_id'],
                    prediction_data['rl_score'],
                    prediction_data['confidence_level'],
                    prediction_data['decision_type'],
                    json.dumps(prediction_data['features_used']),
                    prediction_data['model_version']
                ))
                
                prediction_id = cursor.fetchone()[0]
                conn.commit()
                
                logger.info(f"RL prediction stored: ID {prediction_id}")
                return prediction_id
                
        except Exception as e:
            logger.error(f"Failed to store RL prediction: {e}")
            return None
    
    def store_rl_feedback(self, feedback_data: Dict) -> Optional[int]:
        """Store RL feedback in database"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO rl_feedback 
                    (prediction_id, feedback_source, actual_outcome, feedback_score, reward_signal, feedback_notes)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    feedback_data.get('prediction_id'),
                    feedback_data.get('feedback_source', 'system'),
                    feedback_data['actual_outcome'],
                    feedback_data['feedback_score'],
                    feedback_data['reward_signal'],
                    feedback_data.get('feedback_notes', '')
                ))
                
                feedback_id = cursor.fetchone()[0]
                conn.commit()
                
                logger.info(f"RL feedback stored: ID {feedback_id}")
                return feedback_id
                
        except Exception as e:
            logger.error(f"Failed to store RL feedback: {e}")
            return None
    
    def get_feedback_history(self, candidate_id: int = None, limit: int = 100) -> List[Dict]:
        """Get feedback history for RL learning"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                
                if candidate_id:
                    cursor.execute("""
                        SELECT rf.*, rp.features as candidate_features, rp.rl_score
                        FROM rl_feedback rf
                        JOIN rl_predictions rp ON rf.prediction_id = rp.id
                        WHERE rp.candidate_id = %s
                        ORDER BY rf.created_at DESC
                        LIMIT %s
                    """, (candidate_id, limit))
                else:
                    cursor.execute("""
                        SELECT rf.*, rp.features as candidate_features, rp.rl_score
                        FROM rl_feedback rf
                        JOIN rl_predictions rp ON rf.prediction_id = rp.id
                        ORDER BY rf.created_at DESC
                        LIMIT %s
                    """, (limit,))
                
                feedback_history = []
                for row in cursor.fetchall():
                    feedback_dict = dict(row)
                    # Parse JSON fields
                    if feedback_dict.get('candidate_features'):
                        feedback_dict['candidate_features'] = json.loads(feedback_dict['candidate_features'])
                    feedback_history.append(feedback_dict)
                
                return feedback_history
                
        except Exception as e:
            logger.error(f"Failed to get feedback history: {e}")
            return []
    
    def store_model_performance(self, performance_data: Dict) -> Optional[int]:
        """Store model performance metrics"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO rl_model_performance 
                    (model_version, accuracy, precision_score, recall_score, f1_score, 
                     average_reward, total_predictions, evaluation_date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    performance_data['model_version'],
                    performance_data['accuracy'],
                    performance_data['precision_score'],
                    performance_data['recall_score'],
                    performance_data['f1_score'],
                    performance_data['average_reward'],
                    performance_data['total_predictions'],
                    performance_data['evaluation_date']
                ))
                
                performance_id = cursor.fetchone()[0]
                conn.commit()
                
                logger.info(f"Model performance stored: ID {performance_id}")
                return performance_id
                
        except Exception as e:
            logger.error(f"Failed to store model performance: {e}")
            return None
    
    def get_rl_analytics(self) -> Dict[str, Any]:
        """Get RL system analytics"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                
                # Get prediction counts
                cursor.execute("SELECT COUNT(*) as total_predictions FROM rl_predictions")
                total_predictions = cursor.fetchone()['total_predictions']
                
                # Get feedback counts
                cursor.execute("SELECT COUNT(*) as total_feedback FROM rl_feedback")
                total_feedback = cursor.fetchone()['total_feedback']
                
                # Get latest model performance
                cursor.execute("""
                    SELECT * FROM rl_model_performance 
                    ORDER BY evaluation_date DESC 
                    LIMIT 1
                """)
                latest_performance = cursor.fetchone()
                
                # Get decision type distribution
                cursor.execute("""
                    SELECT decision_type, COUNT(*) as count 
                    FROM rl_predictions 
                    GROUP BY decision_type
                """)
                decision_distribution = {row['decision_type']: row['count'] for row in cursor.fetchall()}
                
                analytics = {
                    "total_predictions": total_predictions,
                    "total_feedback": total_feedback,
                    "feedback_rate": (total_feedback / max(total_predictions, 1)) * 100,
                    "decision_distribution": decision_distribution,
                    "latest_performance": dict(latest_performance) if latest_performance else None,
                    "generated_at": datetime.now().isoformat()
                }
                
                return analytics
                
        except Exception as e:
            logger.error(f"Failed to get RL analytics: {e}")
            return {"error": str(e)}
    
    def log_rl_decision(self, event_data: Dict) -> Optional[int]:
        """Log RL decision event"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    INSERT INTO audit_logs 
                    (action, resource, resource_id, details, timestamp)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    'rl_decision',
                    'rl_predictions',
                    event_data.get('candidate_id'),
                    json.dumps(event_data),
                    datetime.now()
                ))
                
                log_id = cursor.fetchone()[0]
                conn.commit()
                
                return log_id
                
        except Exception as e:
            logger.error(f"Failed to log RL decision: {e}")
            return None
    
    def get_candidate_rl_history(self, candidate_id: int) -> List[Dict]:
        """Get RL decision history for candidate"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                
                cursor.execute("""
                    SELECT rp.*, rf.actual_outcome, rf.feedback_score, rf.reward_signal
                    FROM rl_predictions rp
                    LEFT JOIN rl_feedback rf ON rp.id = rf.prediction_id
                    WHERE rp.candidate_id = %s
                    ORDER BY rp.created_at DESC
                """, (candidate_id,))
                
                history = []
                for row in cursor.fetchall():
                    history_dict = dict(row)
                    if history_dict.get('features'):
                        history_dict['features'] = json.loads(history_dict['features'])
                    history.append(history_dict)
                
                return history
                
        except Exception as e:
            logger.error(f"Failed to get candidate RL history: {e}")
            return []

# Global instance
postgres_adapter = PostgreSQLAdapter()