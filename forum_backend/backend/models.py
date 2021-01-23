from datetime import datetime, timezone
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class Thread(models.Model):
    name=models.CharField(max_length=50, null=False)

    def __str__(self):
        return self.name

def getUTCDate():
        now = datetime.now(tz=timezone.utc)
        return now

class Post(models.Model):
    author=models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    title=models.CharField(max_length=50, null=False)
    thread=models.ForeignKey(Thread, null=False, on_delete=models.CASCADE)
    pub_date=models.DateTimeField(null=False, default=getUTCDate)

    def __str__(self):
        return self.title
    
    def getLatestCommentDate(self):
        return Comment.objects.filter(post=self).order_by("-pub_date")[0].pub_date
    
    

class Comment(models.Model):
    post=models.ForeignKey(Post, on_delete=models.CASCADE, null=False)
    author=models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    content=models.CharField(max_length=255, null=False)
    pub_date=models.DateTimeField(null=False, default=getUTCDate)
