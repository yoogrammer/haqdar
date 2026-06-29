# app/core/eligibility.py
import json
from pathlib import Path
from functools import lru_cache
from typing import List, Dict, Any
from app.utils.logger import logger

class EligibilityEngine:
    """High-performance eligibility matching engine"""
    
    def __init__(self):
        self._schemes = self._load_schemes()
        logger.info(f"Loaded {len(self._schemes)} schemes")
    
    @staticmethod
    def _load_schemes() -> List[Dict]:
        """Load schemes from JSON file"""
        data_path = Path(__file__).parent.parent / "data" / "schemes.json"
        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"schemes.json not found at {data_path}")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in schemes.json: {e}")
            return []
    
    def get_all_schemes(self) -> List[Dict]:
        return self._schemes
    
    def check_eligibility(self, profile: Dict[str, Any]) -> List[Dict]:
        """
        Check eligibility against all schemes
        Returns list of eligible schemes sorted by benefit value
        """
        eligible = []
        
        for scheme in self._schemes:
            if self._is_eligible(profile, scheme.get('eligibility', {})):
                eligible.append(scheme)
        
        # Sort by benefit value (highest first)
        eligible.sort(
            key=lambda s: s.get('annual_benefit_value', 0),
            reverse=True
        )
        
        logger.info(f"Found {len(eligible)} eligible schemes for profile")
        return eligible
    
    def _is_eligible(self, profile: Dict, criteria: Dict) -> bool:
        """Check if profile matches eligibility criteria"""
        checks = [
            self._check_income,
            self._check_age,
            self._check_gender,
            self._check_residence,
            self._check_occupation,
            self._check_caste,
            self._check_bank_account,
            self._check_children,
            self._check_pregnancy,
            self._check_land_ownership,
        ]
        
        return all(check(profile, criteria) for check in checks)
    
    @staticmethod
    def _check_income(profile: Dict, criteria: Dict) -> bool:
        max_income = criteria.get('income_max')
        if max_income is None:
            return True
        return profile.get('income', 0) <= max_income
    
    @staticmethod
    def _check_age(profile: Dict, criteria: Dict) -> bool:
        age = profile.get('age', 0)
        if 'age_min' in criteria and age < criteria['age_min']:
            return False
        if 'age_max' in criteria and age > criteria['age_max']:
            return False
        return True
    
    @staticmethod
    def _check_gender(profile: Dict, criteria: Dict) -> bool:
        if 'gender' not in criteria:
            return True
        return profile.get('gender', '').lower() in criteria['gender']
    
    @staticmethod
    def _check_residence(profile: Dict, criteria: Dict) -> bool:
        if 'residence' not in criteria:
            return True
        return profile.get('residence', '').lower() in criteria['residence']
    
    @staticmethod
    def _check_occupation(profile: Dict, criteria: Dict) -> bool:
        if 'occupation' not in criteria:
            return True
        user_occ = profile.get('occupation', '').lower()
        return any(
            occ in user_occ or user_occ in occ
            for occ in criteria['occupation']
        )
    
    @staticmethod
    def _check_caste(profile: Dict, criteria: Dict) -> bool:
        if 'caste' not in criteria:
            return True
        return profile.get('caste', '').lower() in criteria['caste']
    
    @staticmethod
    def _check_bank_account(profile: Dict, criteria: Dict) -> bool:
        if not criteria.get('has_bank_account'):
            return True
        return profile.get('has_bank_account', False)
    
    @staticmethod
    def _check_children(profile: Dict, criteria: Dict) -> bool:
        if not criteria.get('has_children_studying'):
            return True
        return profile.get('has_children', False)
    
    @staticmethod
    def _check_pregnancy(profile: Dict, criteria: Dict) -> bool:
        if not criteria.get('pregnant_or_lactating'):
            return True
        return profile.get('is_pregnant', False)
    
    @staticmethod
    def _check_land_ownership(profile: Dict, criteria: Dict) -> bool:
        if not criteria.get('land_ownership'):
            return True
        return 'farmer' in profile.get('occupation', '').lower()

# Singleton instance
eligibility_engine = EligibilityEngine()