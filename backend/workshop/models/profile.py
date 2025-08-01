from django.db import models
from .user import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    city = models.CharField(max_length=30, blank=True, null=True)
    state = models.CharField(max_length=30, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'profile'

    def __str__(self):
        return f"Profile of {self.user.username}"
