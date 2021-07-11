from re import search
from django.shortcuts import render
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from .models import *
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from .serializers import *
from rest_framework.renderers import TemplateHTMLRenderer
from django.db.models import Q
from rest_framework.views import APIView
from django.core.files import File
import json
import pandas as pd
import h5py
from tensorflow import keras
import os
# from django.contrib.postgres.search import SearchVector
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
# @parser_classes([MultiPartParser])
def datasets(request):

    if request.method == "GET":
        if request.GET.get("query") is not None:
            query = request.GET.get("query")
            datasets = Dataset.objects.filter(
                Q(name__icontains=query) | Q(description__icontains=query) | Q(owner__username__icontains=query))
        else:
            datasets = Dataset.objects.all()
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        if request.user.is_authenticated:

            if request.data.get("name") is None:
                return Response({"message": "Name field or file field is not provided"}, status=status.HTTP_400_BAD_REQUEST)
            print(request.data)

            file = request.data["file"]
            dataset = Dataset(
                name=request.data["name"], owner=request.user, upload=file)
            dataset.save()
            dataset.libraryOf.add(request.user)
            if request.data.get("description") is not None:
                dataset.description = request.data["description"]
            dataset.save()
            serializer = DatasetSerializer(dataset)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            return Response({"message": "User is not logged"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT', "GET"])
def user_items(request, action):
    if not request.user.is_authenticated:
        return Response({"message": "User is not logged"}, status=status.HTTP_401_UNAUTHORIZED)

    if action == "dataset":
        if request.method == "GET":
            datasets = request.user.datasets
            serializer = DatasetSerializer(datasets, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    if action == "library":
        if request.method == "GET":
            datasets = request.user.libraries
            if request.GET.get("query") is not None:
                query = request.GET.get("query")
                datasets = datasets.filter(Q(name__icontains=query) | Q(
                    description__icontains=query) | Q(owner__username__icontains=query))

            serializer = DatasetSerializer(datasets, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if request.method == "PUT":
            try:
                datasets = Dataset.objects.get(pk=request.data["id"])
            except ObjectDoesNotExist:
                return Response({"message": "This dataset cannot be found"})

            datasets.libraryOf.add(request.user)
            serializer = DatasetSerializer(datasets)
            return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', "GET", "DELETE"])
def dataset(request, pk):
    if request.method == "GET":
        dataset = Dataset.objects.get(pk=pk)
        serializer = DatasetDetailSerializer(dataset)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@parser_classes([FileUploadParser])
def preview(request, type):
    if type == "dataset":
        file = request.data["file"]
        csv = pd.read_csv(file)
        csv = csv.head(25)
        return Response({"table": csv.to_html()})


@api_view(['GET', 'POST'])
def models(request):
    if request.method == "GET":
        models = NeuralNetworkModel.objects.all()
        serializer = NetworkModelSerializer(models, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        model_data = json.dumps(request.data["model"])
        model = keras.models.model_from_json(
            model_data, custom_objects=None)
        # print(model.summary())
        temp = "/tmp/model-{}.h5".format(request.session.session_key)
        # temp = "/tmp/model-{}.h5".format(request.data["name"])
        model.save(temp)
        f = File(h5py.File(temp, mode='r'), name=os.path.basename(temp))
        models = NeuralNetworkModel.objects.create(
            name="test model", description="test description", owner=request.user)
        models.upload.save("model", f)
        # models.save()
        os.remove(temp)
        serializer = NetworkModelSerializer(models)
        return Response(serializer.data)
