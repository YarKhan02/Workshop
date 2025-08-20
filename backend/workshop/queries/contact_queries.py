from workshop.models import BusinessSettings

def get_contact_info():
    settings = BusinessSettings.objects.first()
    if not settings:
        return {}
    
    return {
        "name": settings.name,
        "address": settings.address,
        "city": settings.city,
        "phone": settings.phone,
        "email": settings.email,
    }
