# app/core/database.py
import os
from supabase import create_client, Client
from app.utils.logger import logger

class DatabaseService:
    """Simple database service for tracking submissions"""
    
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        self.client: Client = None
        
        if self.url and self.key:
            try:
                self.client = create_client(self.url, self.key)
                logger.info("Database connected successfully")
            except Exception as e:
                logger.error(f"Database connection failed: {e}")
        else:
            logger.warning("Database credentials not found, tracking disabled")
    
    def save_submission(self, user_data: dict, schemes: list, total_benefit: int) -> bool:
        """Save user submission to database (non-blocking)"""
        if not self.client:
            return False
        
        try:
            scheme_ids = ",".join(str(s.get('id', '')) for s in schemes)
            
            data = {
                "name": user_data.get('name', ''),
                "age": user_data.get('age', 0),
                "gender": user_data.get('gender', ''),
                "state": user_data.get('state', ''),
                "residence": user_data.get('residence', ''),
                "occupation": user_data.get('occupation', ''),
                "income": user_data.get('income', 0),
                "caste": user_data.get('caste', ''),
                "language": user_data.get('language', 'english'),
                "total_schemes": len(schemes),
                "total_benefit": total_benefit,
                "scheme_ids": scheme_ids,
            }
            
            result = self.client.table('submissions').insert(data).execute()
            logger.info(f"Submission saved | user={user_data.get('name')} | schemes={len(schemes)}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save submission: {e}")
            return False
    
    def get_stats(self) -> dict:
        """Get usage statistics"""
        if not self.client:
            return {}
        
        try:
            result = self.client.table('submissions').select('*', count='exact').execute()
            total = result.count or 0
            
            return {
                "total_submissions": total,
                "database_connected": True
            }
        except Exception as e:
            logger.error(f"Failed to fetch stats: {e}")
            return {"database_connected": False}

# Singleton
db_service = DatabaseService()