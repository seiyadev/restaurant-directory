from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid, jwt, datetime
    
class Restaurant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    address = models.CharField(max_length=50)
    phone = models.CharField(max_length=32)

    def __str__(self):
        return self.name
    
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=18, unique=True)
    password = models.CharField(max_length=64)
    email = models.EmailField()

    def __str (self):
        return self.username