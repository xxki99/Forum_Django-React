from typing import Dict
from django.contrib.auth.models import User
from django.db.models import query
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Comment, Thread, UserProfile, Post
from .serializers import CommentSerializer, PostListSerializer, PostDetailSerializer, ThreadDetailSerializer, ThreadSerializer, UserProfileSerializer
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework import mixins
from .permission import IsAdminOrReadOnly
from rest_framework.decorators import action, permission_classes
from rest_framework.reverse import reverse
from rest_framework import status
from django.http.request import QueryDict
from django.db.models import Max


# Create your views here.

"""
Customized viewset for userprofile
Included create, retrieve (not one can view the whole userslist, but everyone can signup or view user-detail view)
"""
class UserProfileViewset(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset=UserProfile.objects.all()
    serializer_class=UserProfileSerializer
    permission_classes=[AllowAny]


"""
Post viewset (include create post, retrieve post and list)

This viewset also included a postComment (subjected to be changed) method for leaving comment without selecting the post. 
Not sure this is useful or not, it can be done in the cliend side application
"""
class PostViewset(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset=Post.objects.all()
    serializer_class=PostDetailSerializer
    permission_classes=[IsAuthenticatedOrReadOnly]

    def list(self, request):
        queryset=Post.objects.all().annotate(latestCommentDate=Max("comment__pub_date")).order_by("-latestCommentDate")
        
        serializer=PostListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
    def get_queryset(self):
        posts=Post.objects.all()
        posts.annotate(max_update_time=Max("comment__pub_date")).order_by("-max_update_time")
        return posts

    #this view help leaving comment without selecting the post by the user (not sure this is useful or not)
    @action(detail=True, methods=['post'], url_path='cm', url_name='postComment')
    def postComment(self, request, pk=None):
        print("headers: ")
        print(request.headers)

        post=reverse("forumAPI:post-detail", pk, request=request)

        print("request data is ")
        print(request.data)

        #depend on the type of request.data, add post to the request data (subjected to be changed)
        isQueryDict = isinstance(request.data, QueryDict)

        if (not isQueryDict):
            request.data["post"]=post
        else:
            #add post to the request data (not able to find another useful answer)
            request.data._mutable=True
            request.data["post"]=post
            request.data._mutable=False
            #(subject to be changed in the future)
        
        serializer=CommentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers=self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


"""
Thread ModelViewset

Overrided retrieve (thread-detail) for changing the serializer
The list serializer is the 'ThreadSerializer', this serializer is for the list view, it does not include the post_set field
The detail serializer includes post_set field
"""
class ThreadViewset(viewsets.ModelViewSet):
    queryset=Thread.objects.all()
    serializer_class=ThreadSerializer
    permission_classes=[IsAdminOrReadOnly]

    #change the serializer to thread detail serializer when the view is detail
    def retrieve(self, request, pk=None):
        queryset=Thread.objects.all()
        thread=get_object_or_404(queryset, pk=pk)
        serializer=ThreadDetailSerializer(thread, context={'request': request})
        return Response(serializer.data)
    
    #this is for writing new post in a thread
    @action(detail=True, methods=["post"], url_path="p", url_name="writePost", permission_classes = [IsAuthenticatedOrReadOnly])
    def writePost(self, request, pk=None):
        thread=reverse("forumAPI:thread-detail", pk, request=request)

        print(request.data)

        isQueryDict = isinstance(request.data, QueryDict)

        if (not isQueryDict):
            request.data["thread"]=thread
        else:
            #add thread to the request data (not able to find another useful answer)
            request.data._mutable=True
            request.data["thread"]=thread
            request.data._mutable=False
            #(subject to be changed in the future)

        serializer=PostDetailSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers=self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

"""
Comment Viewset
This viewset include create and retrieve, no one can read the comment list for all comment

"""
class CommentViewset(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset=Comment.objects.all()
    serializer_class=CommentSerializer



