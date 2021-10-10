from django.forms import ModelForm
from django.forms import forms, widgets
from shops.models import Shop,Item,Variation
from category.models import Category
from django.db.models import fields
from mptt.forms import TreeNodeChoiceField
from django.db import models
from django.forms.models import ModelForm
from django.forms import forms, widgets 
from django import forms

Packing_style=(
('1','Free size'),
('2','Box')
)
class choice(forms.Form):
    packing_style= forms.ChoiceField(
        widget=forms.RadioSelect(), choices=Packing_style)
class ShopForm(ModelForm):
    class Meta:
        model = Shop
        fields = ['name', 'description', 'logo','address','city']
class ItemForm(ModelForm):
    category = TreeNodeChoiceField(queryset=Category.objects.filter(parent__isnull=False,choice=True))
    class Meta:
        model = Item
        fields=['category','name']
class ItemDetailForm(ModelForm):
    category = TreeNodeChoiceField(queryset=Category.objects.filter(parent__isnull=False,choice=True))
    class Meta:
        model = Item
        exclude=['category','item','shop']


'''class VariantForm(ModelForm):
    
    class Meta:
        model = Variant
        exclude = ('shop','likeed','item')
class CuponShopForm(ModelForm):
    
    class Meta:
        model = Coupon
        exclude = ('shop',)
class ShippingShopForm(ModelForm):
    
    class Meta:
        model = Shipping
        exclude = ('shop',)'''