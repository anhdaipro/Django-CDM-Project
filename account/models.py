from django.db import models
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.core.cache import cache 
import datetime
from ecomerce import settings
# Create your models here.
class Customer(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='customer')
    name=models.CharField(max_length=100)
    image=models.ImageField(upload_to='profile/',null=True)
    USER_TYPE=(
        ('C','Customer'),
        ('S','Seller')
    )
    GENDER_CHOICE=(
        ('M','MALE'),
        ('F','FEMALE'),
        ('O','ORTHER')
    )
    user_type=models.CharField(max_length=10,choices=USER_TYPE,blank=True)
    gender=models.CharField(max_length=10,choices=GENDER_CHOICE,blank=True)
    phone_number=models.CharField(max_length=20)
    address=models.CharField(max_length=100)
    zip = models.CharField(max_length=100,blank=True)
    date_of_birth=models.DateField(null=True,blank=True)
    check=models.BooleanField(default=False)
    is_online=models.BooleanField(default=False)
    time_off=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
    
    

class UserOTP(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    time_st=models.DateTimeField(auto_now=True)
    otp = models.SmallIntegerField()
