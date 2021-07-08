from rest_framework import serializers
from .models import *
import pandas as pd


class DatasetSerializer(serializers.ModelSerializer):
    dataset = serializers.SerializerMethodField("get_dataset")
    summary = serializers.SerializerMethodField("get_dataset_summary")

    def get_dataset(self, dataset):
        path = dataset.upload.path
        df = pd.read_csv(path)
        return df.to_json()

    def get_dataset_summary(self, dataset):
        path = dataset.upload.path
        df = pd.read_csv(path)
        summary = df.describe()
        return summary.to_json()

    class Meta:
        model = Dataset
        exclude = ['libraryOf']
        depth = 1


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']
        depth = 1
