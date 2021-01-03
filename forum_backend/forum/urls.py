"""forum URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, reverse_lazy
from django.urls.conf import include
from django.views.generic import RedirectView
from rest_framework.authtoken import views

from backend.urls import forumRouterUrls, authUrls

urlpatterns = [
    path('api/forum/', include((forumRouterUrls, 'forumAPI'))), 
    path('api/auth/', include((authUrls, 'authAPI'))), 
    #path('forum/', include('rest_framework.urls', namespace='rest_framework')), 
    #path('api/token-auth/obtain', views.obtain_auth_token, name="api-token-auth"), 
    path('', RedirectView.as_view(url = reverse_lazy('forumAPI:api-root'))), 
    path('admin/', admin.site.urls)
]
