from rest_framework.permissions import BasePermission


class IsCustomer(BasePermission):
    """
    Custom permission to only allow customers to access the view.
    """
    
    def has_permission(self, request, view):
        # Check if user is authenticated and has customer role
        print(f"DEBUG: Request user: {request.user}")
        print(f"DEBUG: User authenticated: {getattr(request.user, 'is_authenticated', False)}")
        print(f"DEBUG: User role: {getattr(request.user, 'role', None)}")
        
        result = (
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', None) == 'customer'
        )
        print(f"DEBUG: Permission granted: {result}")
        return result
