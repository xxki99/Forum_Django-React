from typing import Dict
from django.contrib.auth.models import User
from django.db.models import query
from django.http.response import Http404, HttpResponse
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Comment, Thread, UserProfile, Post
from .serializers import CommentSerializer, PostListSerializer, PostDetailSerializer, ThreadDetailSerializer, ThreadSerializer, UserProfileSerializer
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import mixins
from .permission import IsAdminOrReadOnly
from rest_framework.decorators import action, permission_classes
from rest_framework.reverse import reverse
from rest_framework import status
from django.http.request import QueryDict
from django.db.models import Max

# Create your views here.

"""
sandbox viewset
"""
"""
class SandBoxViewset(mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset=UserProfile.objects.all()
    serializer_class=UserProfileSerializer
    permission_classes=[AllowAny]

    def list(self, request, *args, **kwargs):
        if request.auth:
            print("request auth")
        else:
            print("unknow user")

        if "Authorization" in request.COOKIES:
            token = request.COOKIES["Authorization"]
            print(token)
        else:
            response = HttpResponse(status=status.HTTP_200_OK, content={"detail": "set token"})
            testingToken = "testing token"
            response.set_cookie("Authorization", "Token %s"%(testingToken))
            return response

        return Response({"detail": "testint sandbox"}, status=status.HTTP_200_OK)
"""



"""
Auth
This class is inherit from ObtainAuthToken, 
the parent class included a view for "post" method for login (post with body object, which contain username and password)

This child class add get method for verifying token (get with {Authorization: token} headers)
not sure using "get" method is right for this use, subject to change

"""
class CustomObtainAuthToken(ObtainAuthToken):
    # prevent return 403, which lead to signin dialog when using browser
    def get_invalidTokenResponse(self):
            returnData = {"Token": "Invalid Token"}
            print("return invalid response")
            return Response(returnData, status=status.HTTP_400_BAD_REQUEST) 

    # override handle-exception, in order to prevent return 403
    def handle_exception(self, exc):
        if (type(exc) == AuthenticationFailed):
            return self.get_invalidTokenResponse()
        return super().handle_exception(exc)

    def get(self, request, format=None):
        print("auth token get")
        if (request.auth):
            user = request.user
            serializers = UserProfileSerializer(user.userprofile)
            return Response(serializers.data, status=status.HTTP_200_OK)
        else:
            return self.get_invalidTokenResponse()

    

"""
Customized viewset for userprofile
Included create, retrieve (not one can view the whole userslist, but everyone can signup or view user-detail view)
"""
class UserProfileViewset(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset=UserProfile.objects.all()
    serializer_class=UserProfileSerializer
    permission_classes=[AllowAny]

    #create a new view for getting post_set of a user
    @action(detail=True, methods=["get"], url_path="postset", url_name="userPostset")
    def getUserPostSet(self, request, pk=None):
        userprofile = get_object_or_404(UserProfile, pk=pk)
        posts = userprofile.post_set.all()
        serializer = PostListSerializer(posts, many=True, context={"request": request})
        returnData = {
            "name": userprofile.user.username, 
            "post_set": serializer.data
        }
        return Response(returnData, status=status.HTTP_200_OK)


"""
Post viewset (include create post, retrieve post and list)

This viewset also included a postComment (subjected to be changed) method for leaving comment without selecting the post. 
Not sure this is useful or not, it can be done in the cliend side application
"""
class PostViewset(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset=Post.objects.all()
    serializer_class=PostDetailSerializer
    permission_classes=[IsAuthenticatedOrReadOnly]

    #change the permission class to admin user only for deleting post
    def get_permissions(self):
        if self.action ==  "destroy":
            destroy_permission_classes = [IsAdminUser]
            return [permission() for permission in destroy_permission_classes]
        else:
            return super().get_permissions()

    def list(self, request):
        queryset=Post.objects.all().annotate(latestCommentDate=Max("comment__pub_date")).order_by("-latestCommentDate")
        
        serializer=PostListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
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
class ThreadViewset(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
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



