from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserProfileViewset)
router.register(r'threads', views.ThreadViewset)

router.register(r'posts', views.PostViewset)
router.register(r'comment', views.CommentViewset)

routerUrls = router.urls

