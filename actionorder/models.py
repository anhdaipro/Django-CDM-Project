from django.db import models
from cloudinary_storage.storage import RawMediaCloudinaryStorage
# Create your models here.
from django.db import models
from cart.models import *
from checkout.models import *
from django.contrib.auth.models import User
from shop.models import *
from mimetypes import guess_type
class Refund(models.Model):
    order = models.ForeignKey(to="checkout.Order", on_delete=models.CASCADE)
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    image=models.ImageField(null=True)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()
    def __str__(self):
        return self.user.username
class CancelOrder(models.Model):
    order = models.ForeignKey(to="checkout.Order", on_delete=models.CASCADE,null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    reason = models.CharField(max_length=200,null=True)
class Media_review(models.Model):
    upload_by=models.ForeignKey(User,
                             on_delete=models.CASCADE)
    file=models.FileField(null=True,storage=RawMediaCloudinaryStorage())
    duration=models.IntegerField(null=True)
    file_preview=models.FileField(null=True)
    def upload_file(self):
        if self.file and hasattr(self.file,'url'):
            return self.file.url
    def media_preview(self):
        if self.file_preview and hasattr(self.file_preview,'url'):
            return self.file_preview.url
    def filetype(self):
        type_tuple = guess_type(self.file.url, strict=True)
        if (type_tuple[0]).__contains__("image"):
            return "image"
        elif (type_tuple[0]).__contains__("video"):
            return "video"
class ReView(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    orderitem = models.ForeignKey(to="cart.OrderItem", on_delete=models.CASCADE)
    media_upload=models.ManyToManyField(Media_review,blank=True)
    review_text = models.CharField(max_length=200,null=True)
    info_more=models.TextField(max_length=2000,null=True)
    review_rating = models.IntegerField(null=True)
    rating_product=models.IntegerField(null=True)
    xu=models.IntegerField(null=True)
    rating_seller_service=models.IntegerField(null=True)
    rating_shipping_service=models.IntegerField(null=True)
    created = models.DateTimeField(auto_now=True)
    anonymous_review=models.BooleanField(default=False)
    edited=models.BooleanField(default=False)
    like=models.ManyToManyField(User,blank=True,related_name='likers')
    class Meta:
        verbose_name_plural = 'Reviews'
    def __str__(self):
        return f"{self.pk}"
    def shop_name(self):
        name=''
        if self.user.shop:
            name=self.user.shop.name
        return name

class Report(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    review=models.ForeignKey(ReView,on_delete=models.CASCADE)
    reson=models.CharField(max_length=2000)
    created = models.DateTimeField(auto_now=True)
class Reply(models.Model):
    review=models.ForeignKey(ReView,on_delete=models.CASCADE)
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    text=models.TextField(max_length=2000)