import re

def is_valid_phone_number(phone: str) -> bool:
    return bool(re.fullmatch(r'^03\d{9}$', phone))
