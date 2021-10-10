from django.db import models
from django.db.models import  Q
# Create your models here.
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from category.models import Category
from django.urls import reverse
from account.models import Customer
from django.utils import timezone
from django.db.models import Max, Min, Count, Avg,Sum

class IpModel(models.Model):
    ip=models.CharField(max_length=100)
    create_at=models.DateTimeField(auto_now=True)
class Shop(models.Model):
    user = models.OneToOneField(User,unique=True,on_delete=models.CASCADE,related_name='shop')
    name = models.CharField(max_length=100,primary_key=True)
    description = models.CharField(max_length=255)
    address=models.CharField(max_length=255)
    city=models.CharField(max_length=255)
    logo = models.ImageField(upload_to='shop/')
    create_at=models.DateTimeField(auto_now=True)
    followers = models.ManyToManyField(User, blank=True, related_name='followers')
    view=models.ManyToManyField(IpModel,blank=True)
    slug=models.SlugField(null=True)
    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("shops:shop", kwargs={"slug": self.slug})
    @property
    def num_follow(self):
        return self.followers.all().count()
    
    def total_view(self):
        return self.view.all().count()
class Item(models.Model):
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    shop=models.ForeignKey(Shop,on_delete=models.CASCADE)
    image_cover=models.ImageField(upload_to='item/',null=True,blank=True)
    image1=models.ImageField(upload_to='item/',null=True,blank=True)
    image2=models.ImageField(upload_to='item/',null=True,blank=True)
    image3=models.ImageField(upload_to='item/',null=True,blank=True)
    image4=models.ImageField(upload_to='item/',null=True,blank=True)
    image5=models.ImageField(upload_to='item/',null=True,blank=True)
    image6=models.ImageField(upload_to='item/',null=True,blank=True)
    image7=models.ImageField(upload_to='item/',null=True,blank=True)
    video = models.FileField(upload_to='videos/',null=True,blank=True)
    description=models.TextField(max_length=2000)
    is_active=models.BooleanField(default=False)
    view=models.ManyToManyField(IpModel,blank=True)
    slug=models.SlugField(unique=True,max_length=100)
    
    liked=models.ManyToManyField(User,blank=True)
    def __str__(self):
        return str(self.name)

    def get_absolute_url(self):
        return reverse("shops:product", kwargs={"slug": self.slug})

    def avaregereview(self):
            # here status = True because in my view i have defined just for those which status is True
        # the aggregate(avarage) --> the word of avarage is up to user
        reviews = Review.objects.filter(item=self).aggregate(
            avarage=Avg('review_rating'))
        avg = 0
        if reviews["avarage"] is not None:
            avg = float(reviews["avarage"])
        return avg

    def countreview(self):
        reviews = Review.objects.filter(item=self).aggregate(count=Count('id'))
        cnt = 0
        if reviews["count"] is not None:
            cnt = int(reviews["count"])
        return cnt
    @property
    def num_like(self):
        return self.liked.all().count()
    
    def total_view(self):
        return self.view.all().count()

class Color(models.Model):
    name=models.CharField(max_length=20)
    image=models.ImageField(upload_to='color/',blank=True,null=True)
    def __str__(self):
        return str(self.name)
    class Meta:
        ordering=['name']

class Size(models.Model):
    name=models.CharField(max_length=20)
    def __str__(self):
        return str(self.name)
    class Meta:
        ordering=['name']

class Shipping(models.Model):
    shop=models.ManyToManyField(Shop,blank=True)
    method=models.CharField(max_length=100)
    shipping_unit = models.CharField(max_length=1000)
    active=models.BooleanField(default=False)
    def __str__(self):
        return str(self.id)

class Variation(models.Model):
    shop=models.ForeignKey(Shop,on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    color=models.ForeignKey(Color, on_delete=models.CASCADE,null=True,blank=True)
    size=models.ForeignKey(Size, on_delete=models.CASCADE,null=True,blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    price=models.IntegerField()
    price_ship=models.FloatField(null=True)
    discount_price=models.IntegerField(blank=True,null=True)
    shipping=models.ForeignKey(Shipping, on_delete=models.CASCADE,null=True,blank=True)
    inventory=models.IntegerField()
    weight=models.IntegerField(null=True)
    height=models.IntegerField(null=True)
    width=models.IntegerField(null=True)
    length=models.IntegerField(null=True)
    def __str__(self):
        return str(self.item)

    class Meta:
        ordering=['color','size']

   

LIKE_CHOICE=(
    ('Like','Like'),
    ('Unlike','Unlike')
)

class Like(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    product=models.ForeignKey(Item,on_delete=models.CASCADE,null=True)
    value=models.CharField(max_length=100,choices=LIKE_CHOICE,null=True,default='Like')
    def __str__(self):
        return '%s %s %s' %(self.user, self.value,self.product)

FOLLOW_CHOICE=(
     ('Follow','Follow'),
    ('Unfollow','Unfollow')
)

class Follow(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    shop=models.ForeignKey(Shop,on_delete=models.CASCADE,null=True)
    value=models.CharField(max_length=100,choices=FOLLOW_CHOICE,null=True,default='Follow')
    def __str__(self):
        return '%s %s %s' %(self.user, self.value,self.product)


class Comment(models.Model):
    product=models.ForeignKey(Item,on_delete=models.CASCADE,null=True)
    comment=models.CharField(max_length=200)
    create_at=models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    likes=models.ManyToManyField(User,blank=True,related_name='comment_likes')
    dislikes=models.ManyToManyField(User,blank=True,related_name='comment_dislikes')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='+')

    def __str__(self):
        return str(self.user.username)

    @property
    def chilren(self):
        return Comment.objects.filter(parent=self).order_by('-create_at').all()
    
    @property
    def is_parent(self):
        if self.parent is None:
     		    return True
        return False

class ThreadManager(models.Manager):
    def by_user(self, **kwargs):
        user = kwargs.get('user')
        lookup = Q(first_person=user) | Q(second_person=user)
        qs = self.get_queryset().filter(lookup).distinct()
        return qs


class Thread(models.Model):
    first_person = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='thread_first_person')
    second_person = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,related_name='thread_second_person')
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    objects = ThreadManager()
    class Meta:
        unique_together = ['first_person', 'second_person']
    def __str__(self):
        return str(self.first_person)

class ChatMessage(models.Model):
    thread = models.ForeignKey(Thread, null=True, blank=True, on_delete=models.CASCADE, related_name='chatmessage_thread')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image=models.ImageField(upload_to='chat/',blank=True,null=True)
    file=models.FileField(upload_to='file/',blank=True,null=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.thread)

class Notification(models.Model):
    	# 1 = Like, 2 = Comment, 3 = Follow
	notification_type = models.IntegerField()
	to_user = models.ForeignKey(User, related_name='notification_to', on_delete=models.CASCADE, null=True)
	from_user = models.ForeignKey(User, related_name='notification_from', on_delete=models.CASCADE, null=True)
	product = models.ForeignKey('Item', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
	comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
	date = models.DateTimeField(default=timezone.now)
	user_has_seen = models.BooleanField(default=False)
 	
RATING_CHOISE=(
(1,1),
(2,2),
(3,3),
(4,4),
(5,5)
)
class Review(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    item=models.ForeignKey(Item, on_delete=models.CASCADE,null=True)
    review_rating= models.IntegerField(choices=RATING_CHOISE,null=True)
    review_text= models.CharField(max_length=1000,null=True)
    create_at=models.DateTimeField(auto_now_add=True, null=True)
    likes=models.ManyToManyField(User,blank=True,related_name='review_likes')
    def __str__(self):
        return self.user.username