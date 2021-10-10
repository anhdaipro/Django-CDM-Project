
from django.db import models
from category.models import Category
from shops.models import Shop,Item
from django.db.models import Q
# Create your models here.
class Brand_Clothes(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
    class Meta:
        verbose_name_plural = 'Brand Clothes'
class Material(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Pants_length(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Style(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Buckle_type(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Origin(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Pants_style(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Sample(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Pants_pattern(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
#bản eo
class Waist_version(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Season(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title

class Shirt_length(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title


class Occasion(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title 

class Skirt_length(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title 
class Dress_Style(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Collar(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Sleeve_lenght(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title

class Type_lock(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Short_type(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title

class Brand_Beaty(models.Model):
    name=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.name
class Expiry(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Formula(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Type_of_nutrition(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Active_Ingredients(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
    class Meta:
        verbose_name_plural = 'Active Ingredients'
class Body_care(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title
class Volume(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title

#shoe

class Brand_shoe(models.Model):
    title=models.CharField(max_length=20,primary_key=True)

class Shoe_material(models.Model):
    title=models.CharField(max_length=20,primary_key=True)

class Shoe_buckle_type(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
class Leather_outside(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
class Marker_Style(models.Model):
    title=models.CharField(max_length=20,primary_key=True)

class High_heel(models.Model):
    title=models.CharField(max_length=20,primary_key=True)

class Shoe_Occasion(models.Model):
    title=models.CharField(max_length=20,primary_key=True)

class Shoe_leather_type(models.Model):
    title=models.CharField(max_length=20,primary_key=True)

class Shoe_collar_height(models.Model):
    title=models.CharField(max_length=20,primary_key=True)

class Suitable_width(models.Model):
    title=models.CharField(max_length=20,primary_key=True)


    																			


# Create your models here.
unint_choice=(
    ('1','mAh'),
    ('2','cell'),
    ('3','Wh'),
)
class Brand_Mobile_Gadgets(models.Model):
    title=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title  

class Warranty_period(models.Model):
    time=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.time
class Battery(models.Model):
    capacity=models.IntegerField(primary_key=True)
    unit = models.CharField(choices=unint_choice,default='1' ,max_length=20)
    def __str__(self):
        return str(self.capacity)
class Ram(models.Model):
    ram=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.ram
class Memory(models.Model):
    memory=models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.memory
class Status(models.Model):
    title = models.CharField(max_length=20,primary_key=True)
    def __str__(self):
        return self.title  
class Warranty_type(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  
class Processor(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  
class Screen(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  
class Phone_Features(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  
class Operating_System(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  
class Telephone_cables(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  
class Sim(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  
class MainCamera(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  
class CameraSelfie(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  

class Watch_case_diameter(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title  

class Strap_material(models.Model):
    title = models.CharField(max_length=50,primary_key=True)
    def __str__(self):
        return self.title 
CHOICE_YES_NO=(
    ('Y','Yes'),
    ('N','No')
)
GENDER_CHOICE=(
        ('M','MALE'),
        ('F','FEMALE'),
        ('O','ORTHER')
    )
Packing_style=(
('1','Free size'),
('2','Box')
)
class Detail_Item(models.Model):
    shop=models.ForeignKey(Shop,on_delete=models.CASCADE)
    category=models.ForeignKey(Category,on_delete=models.CASCADE,limit_choices_to=Q(choice=True))
    item=models.ForeignKey(Item,on_delete=models.CASCADE)
    name=models.CharField(max_length=100,null=True,blank=True)
    #clothes jeans
    brand_clothes=models.ForeignKey(Brand_Clothes,on_delete=models.CASCADE,null=True,blank=True)#skirt,dress
    material=models.ForeignKey(Material,on_delete=models.CASCADE,null=True,blank=True)#skirt
    pants_length=models.ForeignKey(Pants_length,on_delete=models.CASCADE,null=True,blank=True)#,dress
    style=models.ForeignKey(Style,on_delete=models.CASCADE,null=True,blank=True)#skirt,,dress
    sample=models.ForeignKey(Sample,on_delete=models.CASCADE,null=True,blank=True)#skirt,dress
    origin=models.ForeignKey(Origin,on_delete=models.CASCADE,null=True,blank=True)#skirt,dress
    pants_style=models.ForeignKey(Pants_style,on_delete=models.CASCADE,null=True,blank=True)
    petite=models.CharField(max_length=20,choices=CHOICE_YES_NO, null=True,blank=True)#skirt,dress
    season=models.ForeignKey(Season,on_delete=models.CASCADE,null=True,blank=True)#skirt,dress
    waist_version=models.ForeignKey(Waist_version,on_delete=models.CASCADE,null=True,blank=True)#skirt,dress
    very_big=models.CharField(max_length=20,choices=CHOICE_YES_NO, null=True,blank=True)#skirt,dress
    #skirt
    skirt_length=models.ForeignKey(Skirt_length,on_delete=models.CASCADE,null=True,blank=True)#dress,
    occasion=models.ForeignKey(Occasion,on_delete=models.CASCADE,null=True,blank=True)#dress
    dress_style=models.ForeignKey(Dress_Style,on_delete=models.CASCADE,null=True,blank=True)#dress
    #dress
    collar=models.ForeignKey(Collar,on_delete=models.CASCADE,null=True,blank=True)
    sleeve_lenght=models.ForeignKey(Sleeve_lenght,on_delete=models.CASCADE,null=True,blank=True)#T-shirt
    #Tanks & Camisoles
    cropped_top=models.CharField(max_length=20,choices=CHOICE_YES_NO, null=True,blank=True)
    shirt_length=models.ForeignKey(Shirt_length,on_delete=models.CASCADE,null=True,blank=True)
    #jean men
    tallfit=models.CharField(max_length=20,choices=CHOICE_YES_NO, null=True,blank=True)
    #beaty
    brand_beaty=models.ForeignKey(Brand_Beaty,on_delete=models.CASCADE,null=True,blank=True)
    packing_type=models.CharField(choices=Packing_style,null=True,max_length=20)
    date_expiry=models.DateField(null=True,blank=True)
    formula=models.ForeignKey(Formula,on_delete=models.CASCADE,null=True,blank=True)
    expiry=models.ForeignKey(Expiry,on_delete=models.CASCADE,null=True,blank=True)
    body_care=models.ForeignKey(Body_care,on_delete=models.CASCADE,null=True,blank=True)
    active_ingredients=models.ForeignKey(Active_Ingredients,on_delete=models.CASCADE,null=True,blank=True)
    type_of_nutrition=models.ForeignKey(Type_of_nutrition,on_delete=models.CASCADE,null=True,blank=True)
    volume=models.ForeignKey(Volume,on_delete=models.CASCADE,null=True,blank=True)
    ingredient=models.CharField(max_length=100,null=True,blank=True)

    #mobile
    
    brand_mobile_gadgets=models.ForeignKey(Brand_Mobile_Gadgets,on_delete=models.CASCADE,null=True,blank=True)
    sim=models.ForeignKey(Sim,on_delete=models.CASCADE,null=True,blank=True)
    warranty_period=models.ForeignKey(Warranty_period,on_delete=models.CASCADE,null=True,blank=True)
    ram=models.ForeignKey(Ram,on_delete=models.CASCADE,null=True,blank=True)
    memory=models.ForeignKey(Memory,on_delete=models.CASCADE,null=True,blank=True)
    status=models.ForeignKey(Status,on_delete=models.CASCADE,null=True,blank=True)
    warranty_type=models.ForeignKey(Warranty_type,on_delete=models.CASCADE,null=True,blank=True)
    processor=models.ForeignKey(Processor,on_delete=models.CASCADE,null=True,blank=True)
    screen=models.ForeignKey(Screen,on_delete=models.CASCADE,null=True,blank=True)
    phone_features=models.ForeignKey(Phone_Features,on_delete=models.CASCADE,null=True,blank=True)
    operating_system=models.ForeignKey(Operating_System,on_delete=models.CASCADE,null=True,blank=True)
    telephone_cables=models.ForeignKey(Telephone_cables,on_delete=models.CASCADE,null=True,blank=True)
    main_camera=models.ForeignKey(MainCamera,on_delete=models.CASCADE,null=True,blank=True)
    camera_selfie=models.ForeignKey(CameraSelfie,on_delete=models.CASCADE,null=True,blank=True)
    
    #shoes mem
    shoe_brand=models.ForeignKey(Brand_shoe,on_delete=models.CASCADE,null=True,blank=True)
    shoe_material=models.ForeignKey(Shoe_material,on_delete=models.CASCADE,null=True,blank=True)
    shoe_buckle_type=models.ForeignKey(Shoe_buckle_type,on_delete=models.CASCADE,null=True,blank=True)
    leather_outside=models.ForeignKey(Leather_outside,on_delete=models.CASCADE,null=True,blank=True)
    marker_style=models.ForeignKey(Marker_Style,on_delete=models.CASCADE,null=True,blank=True)
    high_heel=models.ForeignKey(High_heel,on_delete=models.CASCADE,null=True,blank=True)
    shoe_occasion=models.ForeignKey(Shoe_Occasion,on_delete=models.CASCADE,null=True,blank=True)
    shoe_leather_type=models.ForeignKey(Shoe_leather_type,on_delete=models.CASCADE,null=True,blank=True)
    shoe_collar_height=models.ForeignKey(Shoe_collar_height,on_delete=models.CASCADE,null=True,blank=True)
    suitable_width=models.ForeignKey(Suitable_width,on_delete=models.CASCADE,null=True,blank=True)
    def __str__(self):
        return str(self.item)
