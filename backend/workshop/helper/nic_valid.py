import re

def is_valid_nic(nic: str) -> bool:
    return bool(re.fullmatch(r'^\d{13}$', nic))