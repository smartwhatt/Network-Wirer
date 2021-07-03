from django.shortcuts import render
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from .serializers import *
# Create your views here.

@api_view(['GET'])
def index(request):
    payload = {
        "/": "Doc of API",
        "/set-csrf": "Get CSRF token",
        "/register": "register new account",
        "/login": "login to an account",
        "/logout": "logout from an account",
        "/user": "Get Logged in user",
        "/user/<int:user_id>": "get or update user by id"
    }
    return Response(payload)

@ensure_csrf_cookie
@api_view(['GET'])
def set_csrf_token(request):
    """
    This will be `/api/set-csrf-cookie/` on `urls.py`
    """
    return Response({"details": "CSRF cookie set"})

@api_view(['POST'])
def register(request):
    if request.data["username"] is None or request.data["email"] is None or request.data["password"] is None:
        return Response({"message": "Please Provide credentials."}, status=status.HTTP_400_BAD_REQUEST)

    username = request.data["username"]
    email = request.data["email"]
    password = request.data["password"]

    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return Response({"message": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)
    login(request, user)
    return Response({"message": "Registered and Logged in successfully."}, status=status.HTTP_201_CREATED)
"""
{
"username":"username",
"password":"12345678",
"email": "email.example.com"
}
"""



@api_view(['POST'])
def login_view(request):
    username = request.data["username"]
    password = request.data["password"]
    user = authenticate(request, username=username, password=password)
    # Check if authentication successful
    if user is not None:
        login(request, user)
        return Response({"message": "Logged in successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({
            "message": "Invalid username and/or password."
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def logout_view(request):
    logout(request)
    return Response({"message": "Logout Successfully"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def authenticated_user(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"message": "User is not logged"}, status=status.HTTP_401_UNAUTHORIZED)