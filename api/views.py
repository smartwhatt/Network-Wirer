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
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser, FileUploadParser

# Create your views here.

@api_view(['GET'])
def index(request):
    payload = {
        "/api": "Doc of API",
        "/api/set-csrf": "Get CSRF token",
        "/api/register": "register new account",
        "/api/login": "login to an account",
        "/api/logout": "logout from an account",
        "/api/user": "Get Logged in user",
        "/api/user/<int:user_id>": "get or update user by id"
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

@api_view(['PUT', "GET", "DELETE"])
def update_user(request, id):
    try:
        if request.method == "GET":
            user = User.objects.get(pk=id)
            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == "PUT":
            if request.user.is_authenticated:

                user = User.objects.get(pk=id)
                if request.user == user or request.user.is_staff:
                    if request.data.get("username") is not None:
                        user.username = request.data["username"]
                    if request.data.get("email") is not None:
                        user.email = request.data["email"]
                    if request.data.get("first_name") is not None:
                        user.first_name = request.data["first_name"]
                    if request.data.get("last_name") is not None:
                        user.last_name = request.data["last_name"]
                    if request.data.get("password") is not None:
                        user.set_password(request.data["password"])

                    user.save()
                    serializer = UserSerializer(user)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "You're not Autherized to do this"}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({"message": "User is not logged"}, status=status.HTTP_401_UNAUTHORIZED)

        if request.method == "DELETE":
            if request.user.is_authenticated:

                user = User.objects.get(pk=id)
                if request.user == user or request.user.is_staff:
                    user.delete()
                    return Response({"message": "Delete user successfully"}, status=status.HTTP_202_ACCEPTED)
                else:
                    return Response({"message": "You're not Autherized to do this"}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({"message": "User is not logged"}, status=status.HTTP_401_UNAUTHORIZED)
    except ObjectDoesNotExist:
        return Response({"message": "User Does not exist"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', "POST"])
def dataset(request):

    if request.method == "GET":
        datasets = Dataset.objects.all()
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        if request.user.is_authenticated:
            try:
                file = request.stream.FILES['file']
                dataset = Dataset(name=request.data["name"], owner=request.user, upload=file)
                dataset.save()
                dataset.libraryOf.add(request.user)
                if request.data.get("description") is not None:
                    dataset.description = request.data["description"]
                dataset.save()
                serializer = DatasetSerializer(dataset)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except request.data.get("name") is None:
                return Response({"message": "Name field or file field is not provided"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "User is not logged"}, status=status.HTTP_401_UNAUTHORIZED)
        