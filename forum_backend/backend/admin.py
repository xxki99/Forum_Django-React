from django.contrib import admin
from backend.models import Post, Thread, UserProfile

class UserProfileAdmin(admin.ModelAdmin):
    fields = ['user']

class ThreadAdmin(admin.ModelAdmin):
    fields = ['name', 'post_set']

class PostAdmin(admin.ModelAdmin):
    fields = ['title', 'author']

# Register your models here.
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Thread, ThreadAdmin)
admin.site.register(Post, PostAdmin)

