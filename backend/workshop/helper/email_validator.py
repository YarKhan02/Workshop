import re
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

VALID_EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com']

def is_valid_email_domain(email: str) -> bool:
    """
    Check if email domain is in the allowed list
    """
    if '@' not in email:
        return False
    domain = email.split('@')[-1]
    return domain.lower() in VALID_EMAIL_DOMAINS