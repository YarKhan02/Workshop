import re

VALID_EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com']

def is_valid_email_domain(email: str) -> bool:
    domain = email.split('@')[-1]
    return domain.lower() in VALID_EMAIL_DOMAINS