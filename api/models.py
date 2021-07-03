from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from .model_fields.datatype import *
# Create your models here.


class User(AbstractUser):
    pass


def data_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'media_root/datasets/user_{0}/{1}'.format(instance.owner.id, filename)

class Dataset(models.Model):
    name = models.CharField(max_length=32)
    description = models.TextField(default="")
    owner = models.ForeignKey(User, on_delete=CASCADE, related_name="datasets")
    libraryOf = models.ManyToManyField(User, blank=True, related_name="libraries")
    # types = models.CharField(max_length=16 , choices=dataType)
    upload = models.FileField(upload_to=data_directory_path)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}: {self.name} by {self.owner.username}"
