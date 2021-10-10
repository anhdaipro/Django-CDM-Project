from django.conf import settings
from django.db import models
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel 
from django.db.models import Q
from account.models import Customer
from django.urls import reverse
class Category(MPTTModel):
    parent = TreeForeignKey('self',blank=True, null=True ,related_name='children', on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    image=models.ImageField(blank=True,upload_to='category_images/')
    slug = models.SlugField(max_length=100,null=True,blank=True)
    choice=models.BooleanField(default=False)
    def __str__(self):
        return self.title   
    def get_model_fields(model):
        fields = {}
        options = model._meta
        for field in sorted(options.concrete_fields + options.many_to_many):
            fields[field.name] = field
        return fields
    def get_absolute_url(self):
        return reverse("home:category", kwargs={"slug": self.slug})
    class Meta:
        verbose_name_plural = 'Categories'
    class MPTTMeta:
        order_insertion_by = ['level']
    # to undrestand better the parrent and child i'm gonna separated by '/' from each other
    def __str__(self):
        full_path = [self.title]
        c = self.parent
        while c is not None:
            full_path.append(c.title)
            c = c.parent
        return ' / '.join(full_path[::-1])
    def chilren(self):
        c = self.parent
        p=[]
        while c is not None:
            c = c.parent
            p.append(Category.object.filter(self=c))
        return p

'''class UrlHit(models.Model):
    url     = models.URLField()
    hits    = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(self.url)

    def increase(self):
        self.hits += 1
        self.save()


class HitCount(models.Model):
    url_hit = models.ForeignKey(UrlHit, editable=False, on_delete=models.CASCADE)
    ip      = models.CharField(max_length=40)
    session = models.CharField(max_length=40)
    date    = models.DateTimeField(auto_now=True)'''