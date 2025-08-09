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

def is_valid_email(email: str) -> bool:
    """
    Comprehensive email validation that checks:
    1. Django's built-in validation (basic format)
    2. Domain must contain at least one dot
    3. Domain must have valid TLD format
    4. No consecutive dots in domain
    """
    try:
        # First, use Django's built-in validator for basic format checking
        validate_email(email)
        
        # Additional domain validation
        if '@' not in email:
            return False
        
        local_part, domain = email.rsplit('@', 1)
        
        # Check if domain contains at least one dot
        if '.' not in domain:
            return False
        
        # Check for consecutive dots in domain
        if '..' in domain:
            return False
        
        # Check if domain starts or ends with dot or hyphen
        if domain.startswith('.') or domain.endswith('.') or domain.startswith('-') or domain.endswith('-'):
            return False
        
        # Split domain into parts
        domain_parts = domain.split('.')
        
        # Domain must have at least 2 parts (e.g., gmail.com)
        if len(domain_parts) < 2:
            return False
        
        # Each part must be valid
        for part in domain_parts:
            if not part:  # Empty part (would happen with consecutive dots, but double-checking)
                return False
            if not re.match(r'^[a-zA-Z0-9-]+$', part):  # Only letters, numbers, and hyphens
                return False
            if part.startswith('-') or part.endswith('-'):  # Cannot start or end with hyphen
                return False
        
        # TLD (last part) should be at least 2 characters and contain only letters
        tld = domain_parts[-1]
        if len(tld) < 2 or not re.match(r'^[a-zA-Z]+$', tld):
            return False
        
        return True
        
    except ValidationError:
        return False