from rest_framework import routers
from . import views
from django.urls import path

forum_router = routers.DefaultRouter()
forum_router.register(r'users', views.UserProfileViewset)
forum_router.register(r'threads', views.ThreadViewset)

forum_router.register(r'posts', views.PostViewset)
forum_router.register(r'comment', views.CommentViewset)

forumRouterUrls = forum_router.urls



authUrls = [
    path('token/', views.CustomObtainAuthToken.as_view(), name="token")
]


