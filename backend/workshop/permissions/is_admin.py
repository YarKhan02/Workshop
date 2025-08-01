from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to users with role 'admin'.
    Assumes user model has a 'role' field.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin')
