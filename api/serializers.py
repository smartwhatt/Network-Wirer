from rest_framework import serializers
from .models import *
import pandas as pd


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        exclude = ['libraryOf']
        depth = 1


class DatasetDetailSerializer(serializers.ModelSerializer):
    dataset = serializers.SerializerMethodField("get_dataset")
    summary = serializers.SerializerMethodField("get_dataset_summary")
    columns = serializers.SerializerMethodField("get_header")

    def get_dataset(self, dataset):
        path = dataset.upload.path
        df = pd.read_csv(path)
        return df.sample(frac=1).reset_index(drop=True).head(25).to_html()

    def get_dataset_summary(self, dataset):
        path = dataset.upload.path
        df = pd.read_csv(path)
        summary = df.describe()
        return summary.to_html()

    def get_header(self, dataset):
        path = dataset.upload.path
        df = pd.read_csv(path)
        return list(df.columns.values)

    class Meta:
        model = Dataset
        exclude = ['libraryOf']
        depth = 1


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']
        depth = 1


class NetworkModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = NeuralNetworkModel
        depth = 1
        fields = "__all__"
