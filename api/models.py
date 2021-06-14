from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
# from .model_fields import layout
# Create your models here.


class User(AbstractUser):
    pass


class Block(models.Model):
    pass


class Blockchain(models.Model):
    pass
