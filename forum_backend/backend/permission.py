from rest_framework.permissions import IsAdminUser, SAFE_METHODS

class IsAdminOrReadOnly(IsAdminUser):
    def has_permission(self, request, view):
        isadmin = super().has_permission(request, view)
        isreadonly = request.method in SAFE_METHODS
        return isadmin or isreadonly


