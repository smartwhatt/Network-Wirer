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
from django.core.files.base import ContentFile
import base64
import json
import pandas as pd
import h5py
from tensorflow import keras
import numpy as np
import tensorflowjs as tfjs
import os
from sklearn.utils import shuffle
from .filters.filters import applyFilter
from sklearn.model_selection import train_test_split
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

    if action == "model":
        if request.method == "GET":
            models = request.user.models
            serializer = NetworkModelSerializer(models, many=True)
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
        if request.GET.get("query") is not None:
            query = request.GET.get("query")
            models = NeuralNetworkModel.objects.filter(Q(name__icontains=query) | Q(
                description__icontains=query) | Q(owner__username__icontains=query))
        serializer = NetworkModelSerializer(models, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        if not request.user.is_authenticated:
            return Response({"message": "User is not logged"}, status=status.HTTP_401_UNAUTHORIZED)

        if request.data.get("model") is None or request.data.get("weight") is None or request.data.get("name") is None:
            return Response({"message": "name or model or weight data is not present"}, status=status.HTTP_400_BAD_REQUEST)
        model_data = json.dumps(request.data["model"])
        weight_data = base64.decodebytes(
            request.data["weight"].encode("ascii"))
        # print(weight_data)
        f = ContentFile(model_data)
        weight = ContentFile(weight_data)
        models = NeuralNetworkModel.objects.create(
            name=request.data["name"], description=request.data["description"], owner=request.user, upload=f, weight=weight)
        models.upload.save("model.json", f)
        models.weight.save("{}.weights.bin".format(
            request.data["name"]), weight)
        # models.save()
        # os.remove(temp)
        serializer = NetworkModelSerializer(models)
        return Response(serializer.data)


@api_view(['GET', 'PUT'])
def model(request, pk):
    try:
        models = NeuralNetworkModel.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({"message": "This Model cannot be found"})
    if request.method == "GET":
        serializer = NetworkModelSerializer(models)
        return Response(serializer.data)
    if request.method == "PUT":
        if not request.user.is_authenticated:
            return Response({"message": "User is not logged"}, status=status.HTTP_401_UNAUTHORIZED)

        if request.data.get("train") is not None:
            if request.data.get("dataset") is None:
                return Response({"message": "dataset id is not provided"}, status=status.HTTP_401_UNAUTHORIZED)
            try:
                dataset = Dataset.objects.get(pk=request.data["dataset"]["id"])
            except ObjectDoesNotExist:
                return Response({"message": "This Dataset cannot be found"})

            df = pd.read_csv(dataset.upload.path)
            if request.data.get("dataset").get("field") is not None:
                df = df[request.data["dataset"]["field"]]
            else:
                df = df
            data = df.values
            train, label = data[:, :-1], data[:, -1]
            train, label = shuffle(train, label)
            train = np.asarray(train).astype(np.float32)

            if request.data.get("dataset").get("train_filter") is not None:
                train = applyFilter(
                    train, request.data["dataset"]["train_filter"])
            if request.data.get("dataset").get("label_filter") is not None:
                label = applyFilter(
                    label, request.data["dataset"]["label_filter"])
            model = tfjs.converters.load_keras_model(models.upload.path)
            model.compile(
                optimizer='adam', loss="sparse_categorical_crossentropy", metrics=["accuracy"])
            history = model.fit(x=train, y=label, validation_split=0.2,
                                epochs=request.data["epoch"], shuffle=True, verbose=0)
            if models.dataset is not None:
                models.dataset = dataset
                models.save()
            os.remove(models.upload.path)
            tfjs.converters.save_keras_model(
                model, 'media_root/models/user_{0}/{1}'.format(request.user.id, models.id))

            return Response(history.history)


"""
{
    "model":1,
    "dataset": {
        "id":1,
        //assuming the last 
        "field":[] // if none then all
        "train_filter":[], // optional
        "label_filter":[], // optional

    }
    "epoch":50,
    "train":true
}
"""
