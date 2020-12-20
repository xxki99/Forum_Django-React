from rest_framework import serializers
from rest_framework.serializers import Serializer
from .models import UserProfile, Thread, Post, Comment
from django.contrib.auth.models import User
from rest_framework.exceptions import NotAuthenticated
from django.db.models import Max


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    #url=serializers.HyperlinkedIdentityField(view_name="forumAPI:userprofile-detail")
    username=serializers.CharField(source="user.username")
    email=serializers.EmailField(source="user.email")
    password=serializers.CharField(write_only=True)
    post_set=serializers.HyperlinkedRelatedField(view_name="forumAPI:post-detail", read_only=True, many=True)
    date_joined=serializers.DateTimeField(source="user.date_joined", read_only=True)

    class Meta:
        model=UserProfile
        fields=["username","email", "password", "date_joined", "post_set"]
        extra_kwargs={
            "username": {"write_only": True}, 
            "password": {"write_only": True}, 
            "email": {"write_only": True}
        }
    
    #Overrided create, this help creating user for the corresponding userprofile
    #Before save the new userprofile, it will first create a new user, 
    #and then save it and pass it to the user filed of the new userfile
    def create(self, validated_data):
        userinfo=validated_data.pop("user")
        username=userinfo["username"]
        password=validated_data.pop("password")
        email=userinfo["email"]
        user=User()
        user.username=username
        user.email=email
        user.set_password(password)
        userprofile=UserProfile(**validated_data)
        userprofile.user=user
        user.save()
        userprofile.save()
        return userprofile

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    author=serializers.HyperlinkedRelatedField(view_name="forumAPI:userprofile-detail", read_only=True)
    post=serializers.HyperlinkedRelatedField(view_name="forumAPI:post-detail", queryset=Post.objects.all(), write_only=True)
    authorName=serializers.CharField(source="author.user.username", read_only=True)

    class Meta:
        model=Comment
        fields=["author", "authorName", "post", "content", "pub_date"]
    
    #This will set the user to the logined user, so the user cannot set it by themselves
    def create(self, validated_data):
        author=None
        request=self.context.get("request", None)
        if request:
            author=request.user.userprofile
        if author == None:
            raise NotAuthenticated(detail="Not authenticated for this action", code=401)
        comment=Comment(**validated_data)
        comment.author=author
        comment.save()
        return comment

class PostListSerializer(serializers.HyperlinkedModelSerializer):
    url=serializers.HyperlinkedIdentityField(view_name="forumAPI:post-detail")
    author=serializers.HyperlinkedRelatedField(view_name="forumAPI:userprofile-detail", read_only=True)
    authorName = serializers.CharField(source="author.user.username", read_only=True)
    thread=serializers.HyperlinkedRelatedField(view_name="forumAPI:thread-detail", read_only=False, queryset=Thread.objects.all())

    class Meta:
        model=Post
        fields=["url", "title", "author", "authorName", "thread", "pub_date"]

class PostDetailSerializer(serializers.HyperlinkedModelSerializer):
    url=serializers.HyperlinkedIdentityField(view_name="forumAPI:post-detail")
    author=serializers.HyperlinkedRelatedField(view_name="forumAPI:userprofile-detail", read_only=True)
    authorName=serializers.CharField(source="author.user.username", read_only=True)
    thread=serializers.HyperlinkedRelatedField(view_name="forumAPI:thread-detail", read_only=False, queryset=Thread.objects.all())
    comment_set=CommentSerializer(read_only=True, many=True)

    content=serializers.CharField(max_length=512, write_only=True)

    class Meta:
        model=Post
        fields=["url", "title", "author", "authorName", "thread", "pub_date", "content", "comment_set"]
        read_only_fields=["comment_set", "pub_date"]
        extra_kwargs={
            "content": {"write_only": True}
        }

    #Overrided the create method, this will set the author to the logined user, so the user cannot set it by themselves
    def create(self, validated_data):
        author=None
        request=self.context.get("request", None)
        if request:
            print(request.user.username)
            print("found user")
            author=request.user.userprofile
        if author == None:
            print("User not found")
            raise NotAuthenticated(detail="Not authenticated for this action", code=401)
        content=validated_data.pop("content")
        post=Post(**validated_data)
        post.author=author
        comment=Comment()
        comment.author=post.author
        comment.content=content
        post.save()
        comment.post=post
        comment.save()
        return post

#This serializer is for thread-list
class ThreadSerializer(serializers.HyperlinkedModelSerializer):
    url=serializers.HyperlinkedIdentityField(view_name="forumAPI:thread-detail")

    class Meta:
        model=Thread
        fields=["url", "name"]
        read_only_fields=["name"]

#This serializer is for thread-detail
class ThreadDetailSerializer(serializers.HyperlinkedModelSerializer):
    url=serializers.HyperlinkedIdentityField(view_name="forumAPI:thread-detail")


    #Display the post by default postlist serializer or using (moethod field and override set_post_set modthod to change the order of post list)
    #Default
    #post_set=PostListSerializer(many=True)

    #method field
    post_set=serializers.SerializerMethodField()

    #change the order of post_set when viewing from thread-detail view
    def get_post_set(self, instance):
        #Sort post_set by the latest date of publish (-pub_date)
        if (instance.name=="All"):
            postList=Post.objects.all()
        else:
            postList=instance.post_set.all()
        
        posts = postList.annotate(max_update_time=Max('comment__pub_date')).order_by("-max_update_time")

        request=self.context.get("request", None)
        if request:
            return PostListSerializer(posts, many=True, context={"request": request}).data
        else:
            raise NotAuthenticated(detail="Not authenticated for this action", code=401)

    class Meta:
        model=Thread
        fields=["url", "name", "post_set"]
        read_only_fields=["name", "post_set"]


