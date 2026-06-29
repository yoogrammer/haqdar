# app/core/database.py
import os
from app.utils.logger import logger

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    logger.warning("Supabase not installed")


class DatabaseService:
    """Simple database service for tracking submissions"""
    
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
        self.key = os.getenv("SUPABASE_KEY", "").strip()
        self.client = None
        
        # Debug logging
        logger.info(f"Supabase URL: {self.url[:50] if self.url else 'NOT SET'}...")
        logger.info(f"Supabase KEY: {'SET' if self.key else 'NOT SET'}")
        
        if SUPABASE_AVAILABLE and self.url and self.key:
            try:
                self.client = create_client(self.url, self.key)
                logger.info("✅ Database client created")
                
                # Test connection
                try:
                    test = self.client.table('submissions').select('id').limit(1).execute()
                    logger.info(f"✅ Database test query successful")
                except Exception as test_error:
                    logger.error(f"❌ Database test failed: {test_error}")
                    
            except Exception as e:
                logger.error(f"❌ DB connection failed: {e}")
                self.client = None
        else:
            logger.warning(f"DB not configured: available={SUPABASE_AVAILABLE}, url={bool(self.url)}, key={bool(self.key)}")
    
    def save_submission(self, user_data: dict, schemes: list, total_benefit: int) -> bool:
        """Save user submission"""
        if not self.client:
            logger.warning("Database client not available")
            return False
        
        try:
            scheme_ids = ",".join(str(s.get('id', '')) for s in schemes)
            
            data = {
                "name": str(user_data.get('name', ''))[:100],
                "age": int(user_data.get('age', 0)),
                "gender": str(user_data.get('gender', '')),
                "state": str(user_data.get('state', '')),
                "residence": str(user_data.get('residence', '')),
                "occupation": str(user_data.get('occupation', '')),
                "income": int(user_data.get('income', 0)),
                "caste": str(user_data.get('caste', '')),
                "language": str(user_data.get('language', 'english')),
                "total_schemes": len(schemes),
                "total_benefit": int(total_benefit),
                "scheme_ids": scheme_ids[:500],
            }
            
            logger.info(f"Attempting to save: {data.get('name')}")
            
            result = self.client.table('submissions').insert(data).execute()
            
            logger.info(f"✅ Saved successfully: {result}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Save failed with error: {type(e).__name__}: {str(e)}")
            return False
    
    def get_stats(self) -> dict:
        """Get statistics"""
        if not self.client:
            return {"connected": False, "reason": "client_not_initialized"}
        
        try:
            result = self.client.table('submissions').select('*', count='exact').execute()
            return {
                "connected": True,
                "total_submissions": result.count or 0,
                "url_set": bool(self.url),
                "key_set": bool(self.key)
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "url_set": bool(self.url),
                "key_set": bool(self.key)
            }


db_service = DatabaseService()