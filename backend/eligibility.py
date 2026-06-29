# backend/eligibility.py

import json
import os

def load_schemes():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, 'schemes.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def check_eligibility(user_profile: dict) -> list:
    schemes = load_schemes()
    eligible_schemes = []

    income = user_profile.get('income', 0)
    age = user_profile.get('age', 0)
    gender = user_profile.get('gender', '').lower()
    caste = user_profile.get('caste', '').lower()
    occupation = user_profile.get('occupation', '').lower()
    residence = user_profile.get('residence', '').lower()
    has_bank_account = user_profile.get('has_bank_account', False)
    has_ration_card = user_profile.get('has_ration_card', False)
    has_children = user_profile.get('has_children', False)
    is_pregnant = user_profile.get('is_pregnant', False)

    for scheme in schemes:
        eligibility = scheme.get('eligibility', {})
        is_eligible = True

        # Income check
        if 'income_max' in eligibility:
            if income > eligibility['income_max']:
                is_eligible = False
                continue

        # Age min check
        if 'age_min' in eligibility:
            if age < eligibility['age_min']:
                is_eligible = False
                continue

        # Age max check
        if 'age_max' in eligibility:
            if age > eligibility['age_max']:
                is_eligible = False
                continue

        # Gender check
        if 'gender' in eligibility:
            if gender not in eligibility['gender']:
                is_eligible = False
                continue

        # Residence check
        if 'residence' in eligibility:
            if residence not in eligibility['residence']:
                is_eligible = False
                continue

        # Occupation check
        if 'occupation' in eligibility:
            occupation_match = any(
                occ in occupation or occupation in occ
                for occ in eligibility['occupation']
            )
            if not occupation_match:
                is_eligible = False
                continue

        # Bank account check
        if eligibility.get('has_bank_account') and not has_bank_account:
            is_eligible = False
            continue

        # Children check
        if eligibility.get('has_children_studying') and not has_children:
            is_eligible = False
            continue

        # Pregnancy check
        if eligibility.get('pregnant_or_lactating') and not is_pregnant:
            is_eligible = False
            continue

        # Caste check
        if 'caste' in eligibility:
            if caste not in eligibility['caste']:
                is_eligible = False
                continue

        # Land/farmer check
        if eligibility.get('land_ownership') and 'farmer' not in occupation:
            is_eligible = False
            continue

        if is_eligible:
            eligible_schemes.append(scheme)

    return eligible_schemes