from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from .model_fields.datatype import *
from django.core.validators import FileExtensionValidator
# Create your models here.


class User(AbstractUser):
    pass


def data_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'datasets/user_{0}/{1}'.format(instance.owner.id, filename)


def model_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'models/user_{0}/{1}/{2}'.format(instance.owner.id, instance.id, filename)


class Dataset(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField(default="")
    owner = models.ForeignKey(User, on_delete=CASCADE, related_name="datasets")
    libraryOf = models.ManyToManyField(
        User, blank=True, related_name="libraries")
    # types = models.CharField(max_length=16 , choices=dataType)
    upload = models.FileField(upload_to=data_directory_path, validators=[
                              FileExtensionValidator(allowed_extensions=['csv'])])
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}: {self.name} by {self.owner.username}"


class NeuralNetworkModel(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField(default="")
    owner = models.ForeignKey(User, on_delete=CASCADE, related_name="models")
    # libraryOf = models.ManyToManyField(
    #     User, blank=True, related_name="modelLibraries")
    # types = models.CharField(max_length=16 , choices=dataType)
    upload = models.FileField(upload_to=model_directory_path, validators=[
                              FileExtensionValidator(allowed_extensions=['json'])])
    weight = models.FileField(upload_to=model_directory_path, validators=[
                              FileExtensionValidator(allowed_extensions=['bin'])])
    dataset = models.ForeignKey(
        Dataset, on_delete=CASCADE, related_name="models", null=True, blank=True, default=None)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}: {self.name} by {self.owner.username}"
