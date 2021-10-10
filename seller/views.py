
from account.form import LoginForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from product_detail.models import Detail_Item
from django.shortcuts import render, redirect
from django.contrib import messages
from account.models import Customer
from shops.models import Shop,Variation,Item,Color,Size,Shipping
from product_detail.models import *
from category.models import Category
from django.db.models import Max, Min, Count, Avg,Sum,F
from django.contrib.auth import authenticate,login,logout
from seller.form import ShopForm,ItemForm,ItemDetailForm
from django.http import JsonResponse
from django.core import serializers
import json
from calendar import weekday, day_name
import random
from seller.form import *
from django.utils import timezone
from datetime import timedelta
import datetime
from order.form import CheckForm
from order.models import *
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models.functions import ExtractYear, ExtractMonth,ExtractHour,ExtractHour,ExtractDay,TruncDay,TruncHour
from seller.charts import months, colorPrimary, colorSuccess, colorDanger, generate_color_palette, get_year_dict
def login_vendor(request):
    form = LoginForm(request.POST or None)    
    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(request, username=username, password=password)
            
        if user is not None:
            login(request, user)
            return redirect('vendor:add_item')
    return render(request, "vendor/login.html", {"form": form})


def index(request):
    shop=Shop.objects.get(user=request.user)
    orders = Order.objects.filter(shop=shop,ordered=True,received=True)
    total=0
    for order in orders:
        total+=order.total_final()
    
    return render(request, "vendor/index.html", {
        'shop':shop,
        'total':total,
    })

@login_required
def add_item(request):
    if request.method=='POST':
        category=request.POST.get('category')
        name=request.POST.get('name')
        ids = random.randint(1, 99999999)
        catego= Category.objects.filter(title=category).last()
        shop=Shop.objects.get(user=request.user)
        slug=str(name).replace(' ','-') + '.' + str(ids)
        item = Item.objects.create(
        shop = shop,
        name = name,
        slug=slug,
        category=catego,
        )
        product_detail=Detail_Item.objects.create(
        shop = shop,
        item=item,
        category=catego
        )
        data={
            "item":item.name
        }
        return JsonResponse(data,status=200)
        
    else:
        form=Packing_style
        category=Category.objects.all()
        
        
        return render(request, 'vendor/add-item.html', {'category':category,'form':form,})
def add_item_detail(request):
    if request.method=='POST':
        items=Item.objects.filter(description='').last()
        detail_item=Detail_Item.objects.filter(name__isnull=True).last()
        shop=Shop.objects.get(user=request.user)
        item_last=Item.objects.filter(description__isnull=False).last()
        #item
        name=request.POST.get('name')
        
        if item_last:
            slug=str(name).lower().replace(',', '-').replace(' - ', '-').replace(' ','-') + '.' + str(item_last.id)
        else:
            slug=str(name).lower().replace(',', '-').replace(' - ', '-').replace(' ','-') + '.' + str(0)
        item = Item.objects.create(
        shop = shop,
        name = name,
        category=items.category,
        description = request.POST.get('description'),
        image_cover=request.FILES.get('image_cover'),
        image1=request.FILES.get('image1'),
        image2=request.FILES.get('image2'),
        image3=request.FILES.get('image3'),
        image4=request.FILES.get('image4'),
        image5=request.FILES.get('image5'),
        image6=request.FILES.get('image6'),
        image7=request.FILES.get('image7'),
        video=request.FILES.get('video'),
        slug=slug
        )
        
        
        # clothes
        brand_clothes=Brand_Clothes.objects.filter(title=request.POST.get('brand_clothes')).last()#
        material=Material.objects.filter(title=request.POST.get('material')).last()#
        pants_length=Pants_length.objects.filter(title=request.POST.get('pants_length')).last()#
        sample=Sample.objects.filter(title=request.POST.get('sample')).last()#
        style=Style.objects.filter(title=request.POST.get('style')).last()#
        origin=Origin.objects.filter(title=request.POST.get('origin')).last()#
        pants_style=Pants_style.objects.filter(title=request.POST.get('pants_style')).last()#skirt,jeans,Leggings & Treggings
        petite=request.POST.get('yes_no')#
        season=Season.objects.filter(title=request.POST.get('material')).last()#
        waist_version=Waist_version.objects.filter(title=request.POST.get('material')).last()#jeans,dress
        very_big=request.POST.get('yes_no')#
        skirt_length=Skirt_length.objects.filter(title=request.POST.get('skirt_length')).last()#dress,skirt
        occasion=Occasion.objects.filter(title=request.POST.get('occasion')).last()#dress,skirt,Pants
        dress_style=Dress_Style.objects.filter(title=request.POST.get('dress_style')).last()#dress,skirt
        #dress
        collar=Collar.objects.filter(title=request.POST.get('collar')).last()#dress,t-shirt
        sleeve_lenght=Sleeve_lenght.objects.filter(title=request.POST.get('sleeve_length')).last()#dress,t-shirt
        #Tanks & Camisoles,Tube Tops,t-shirts
        cropped_top=request.POST.get('yes_no')#Tanks & Camisoles
        shirt_length=Shirt_length.objects.filter(title=request.POST.get('shirt_length')).last()
        #jean men
        tallfit=request.POST.get('yes_no')#jean men
        #beauty
        brand_beaty=Brand_Beaty.objects.filter(name=request.POST.get('brand_beaty')).last()
        packing_type=request.POST.get('packing_type')
        date_expiry=request.POST.get('date_expiry')
        formula=Formula.objects.filter(title=request.POST.get('formula')).last()
        expiry=Expiry.objects.filter(title=request.POST.get('expiry')).last()
        body_care=Body_care.objects.filter(title=request.POST.get('body_care')).last()
        active_ingredients=Active_Ingredients.objects.filter(title=request.POST.get('active_ingredients')).last()
        type_of_nutrition=Type_of_nutrition.objects.filter(title=request.POST.get('type_of_nutrition')).last()
        volume=Volume.objects.filter(title=request.POST.get('volume')).last()
        ingredient=request.POST.get('ingredient')

        #sgoe men
        shoe_brand=Brand_shoe.objects.filter(title=request.POST.get('shoe_brand')).last()
        shoe_material=Shoe_material.objects.filter(title=request.POST.get('shoe_material')).last()
        shoe_buckle_type=Shoe_buckle_type.objects.filter(title=request.POST.get('shoe_buckle_type')).last()
        leather_outside=Leather_outside.objects.filter(title=request.POST.get('leather_outside')).last()
        marker_style=Marker_Style.objects.filter(title=request.POST.get('marker_style')).last()
        high_heel=High_heel.objects.filter(title=request.POST.get('high_heel')).last()
        shoe_occasion=Shoe_Occasion.objects.filter(title=request.POST.get('shoe_occasion')).last()
        shoe_leather_type=Shoe_leather_type.objects.filter(title=request.POST.get('shoe_leather_type')).last()
        shoe_collar_height=Shoe_collar_height.objects.filter(title=request.POST.get('shoe_collar_height')).last()
        suitable_width=Suitable_width.objects.filter(title=request.POST.get('suitable_width')).last()

        #mobile
        sim=Sim.objects.filter(title=request.POST.get('sim')).last()
        brand_mobile_gadgets=Brand_Mobile_Gadgets.objects.filter(title=request.POST.get('brand_mobile_gadgets')).last()
        warranty_period=Warranty_period.objects.filter(time=request.POST.get('warranty_period')).last()
        ram=Ram.objects.filter(ram=request.POST.get('ram')).last()
        memory=Memory.objects.filter(memory=request.POST.get('memory')).last()
        battery=Battery.objects.filter(capacity=request.POST.get('battery')).last()
        status=Status.objects.filter(title=request.POST.get('status')).last()
        warranty_type=Warranty_type.objects.filter(title=request.POST.get('warranty_type')).last()
        processor=Processor.objects.filter(title=request.POST.get('processor')).last()
        screen=Screen.objects.filter(title=request.POST.get('screen')).last()
        phone_features=Phone_Features.objects.filter(title=request.POST.get('phone_features')).last()
        operating_system=Operating_System.objects.filter(title=request.POST.get('operating_system')).last()
        telephone_cables=Telephone_cables.objects.filter(title=request.POST.get('telephone_cables')).last()
        main_camera=MainCamera.objects.filter(title=request.POST.get('main_camera')).last()
        camera_selfie=CameraSelfie.objects.filter(title=request.POST.get('camera_selfie')).last()

        detail_items=Detail_Item(
        name=name,
        category=detail_item.category,
        shop=shop,
        item=Item.objects.exclude(description='').filter(shop=shop,name=name).first(),
            # clotes,jeans,pants,
        brand_clothes=brand_clothes,#
        material=material,#
        style=style,#
        sample=sample,#
        origin=origin,#
        pants_style=pants_style,#
        petite=petite,#
        season=season,#
        waist_version=waist_version,#
            #dress,skirt
        skirt_length=skirt_length,#dress,skirt
        occasion=occasion,#dress,skirt
        dress_style=dress_style,#dress,skirt
            #dress
        collar=collar,
        sleeve_lenght=sleeve_lenght,
        pants_length=pants_length,#jeans,dress
            #Tanks & Camisoles
        cropped_top=cropped_top,
            #jean men
        tallfit=tallfit,
            #Tanks & Camisoles,Tube Tops,t-shirts
        shirt_length=shirt_length,
            #beauty
        brand_beaty=brand_beaty,
        packing_type=packing_type,
        date_expiry=date_expiry,
        formula=formula,
        expiry=expiry,
        body_care=body_care,
        active_ingredients=active_ingredients,
        type_of_nutrition=type_of_nutrition,
        volume=volume,
        ingredient=ingredient,
            #mobile and tablet
        sim=sim,
        brand_mobile_gadgets=brand_mobile_gadgets,
        warranty_period=warranty_period,
        ram=ram,
        memory=memory,
        status=status,
        warranty_type=warranty_type,
        processor=processor,
        screen=screen,
        phone_features=phone_features,
        operating_system=operating_system,
        telephone_cables=telephone_cables,
        main_camera=main_camera,
        camera_selfie=camera_selfie,

        #sgoe
        shoe_brand=shoe_brand,
        shoe_material=shoe_material,
        shoe_buckle_type=shoe_buckle_type,
        leather_outside=leather_outside,
        marker_style=marker_style,
        high_heel=high_heel,
        shoe_occasion=shoe_occasion,
        shoe_leather_type=shoe_leather_type,
        shoe_collar_height=shoe_collar_height,
        suitable_width=suitable_width,
        )
        detail_items.save()
        #size
        size=Size.objects.create(
            name=request.POST.get('size')
        )
        #color
        color=Color.objects.create(
            name=request.POST.get('color'),
            image=request.FILES.get('color_image')
        )
        method=request.POST.get('method')
        #shipping
        shipping=Shipping.objects.filter(method=method,active=True,shop=shop).first(),
        #variant
        variant,created = Variation.objects.get_or_create(
            shop=shop,
            item=Item.objects.exclude(description='').filter(shop=shop,name=name).first(),
            color=Color.objects.filter(name=request.POST.get('color')).first(),
            size=Size.objects.filter(name=request.POST.get('size')).first(),
            price=int(request.POST.get('price')),
            discount_price=int(request.POST.get('discount_price')),
            inventory=int(request.POST.get('inventory')),
            shipping=Shipping.objects.filter(active=True,shop=shop,method=method).first(),
            weight=int(request.POST.get('weight')),
            height=int(request.POST.get('height')),
            length=int(request.POST.get('length')),
            width=int(request.POST.get('width')),
        )
        if variant.weight <= 500 and variant.shipping.method == 'Nhanh':
            variant.price_ship = 0.8
        elif variant.weight > 500 and variant.shipping.method == 'Nhanh':
            variant.price_ship = 1
        elif variant.weight > 500 and variant.weight <= 1000 and variant.shipping.method == 'Hỏa tốc':
            variant.price_ship = 1.2
        elif variant.weight <= 500 and variant.shipping.method == 'Hỏa tốc':
            variant.price_ship = 1
        else:
            variant.price_ship = 1.5
        variant.save()
        if Size.objects.filter(variation=None):
            Size.objects.filter(variation=None).delete()
        if Color.objects.filter(variation=None):
            Color.objects.filter(variation=None).delete()

        if Item.objects.exclude(description='').filter(shop=shop,name=name).count() > 1:
            Item.objects.exclude(description='').filter(shop=shop,name=name).last().delete()
            Detail_Item.objects.filter(shop=shop,name=name).last().delete()
        if Item.objects.filter(description=''):
            Item.objects.filter(description='').delete()
            return JsonResponse({'a':'a'})
        return JsonResponse({'product':'ok'})
        
    else:
        category=Category.objects.all()
        items=Item.objects.filter(description='').last()
        detail_item=Detail_Item.objects.filter(name__isnull=True).last()
        shipping=Shipping.objects.filter(active=True)
        category_child=Category.objects.get(detail_item=detail_item.id)
        brand_clothes=Brand_Clothes.objects.all()
        material=Material.objects.all()
        pants_length=Pants_length.objects.all()
        sample=Sample.objects.all()
        style=Style.objects.all()
        origin=Origin.objects.all()
        pants_style=Pants_style.objects.all()
        season=Season.objects.all()
        waist_version=Waist_version.objects.all()
        shirt_length=Shirt_length.objects.all()
        #beauty
        brand_beaty=Brand_Beaty.objects.all()
        formula=Formula.objects.all()
        expiry=Expiry.objects.all()
        body_care=Body_care.objects.all()
        active_ingredients=Active_Ingredients.objects.all()
        type_of_nutrition=Type_of_nutrition.objects.all()
        volume=Volume.objects.all()

        #mobile
        sim=Sim.objects.all()
        brand_mobile_gadgets=Brand_Mobile_Gadgets.objects.all()
        warranty_period=Warranty_period.objects.all()
        ram=Ram.objects.all()
        memory=Memory.objects.all()
        battery=Battery.objects.all()
        status=Status.objects.all()
        warranty_type=Warranty_type.objects.all()
        processor=Processor.objects.all()
        screen=Screen.objects.all()
        phone_features=Phone_Features.objects.all()
        operating_system=Operating_System.objects.all()
        telephone_cables=Telephone_cables.objects.all()
        main_camera=MainCamera.objects.all()
        camera_selfie=CameraSelfie.objects.all()
        #shoe
        shoe_brand=Brand_shoe.objects.all()
        shoe_material=Shoe_material.objects.all()
        shoe_buckle_type=Shoe_buckle_type.objects.all()
        leather_outside=Leather_outside.objects.all()
        marker_style=Marker_Style.objects.all()
        high_heel=High_heel.objects.all()
        shoe_occasion=Shoe_Occasion.objects.all()
        shoe_leather_type=Shoe_leather_type.objects.all()
        shoe_collar_height=Shoe_collar_height.objects.all()
        suitable_width=Suitable_width.objects.all()
        #category
        women_clothes=Category.objects.get(title="Women Clothes")
        men_clothes=Category.objects.get(title="Men Clothes")
        beauty=Category.objects.get(title="Beauty")
        health=Category.objects.get(title="Health")
        fashion_ccessories=Category.objects.get(title="Fashion Accessories")
        home_appliances=Category.objects.get(title="Home Appliances")
        men_shoes=Category.objects.get(title="Men Shoes")
        mobile_gadgets=Category.objects.get(title="Mobile & Gadgets")
        form= Packing_style
        context={
            'category':category,'items':items,'detail_item':detail_item,"shipping":shipping,
            'women_clothes':women_clothes,
            'men_clothes':men_clothes,'beauty':beauty,'health':health,'fashion_ccessories':fashion_ccessories,
            'home_appliances':home_appliances,'men_shoes':men_shoes,'men_shoes':men_shoes,
            'mobile_gadgets':mobile_gadgets,'brand_clothes':brand_clothes,'material':material,
            'pants_length':pants_length,'sample':sample,'style':style,'origin':origin,'pants_style':pants_style,
            'season':season,'waist_version':waist_version,'category_child':category_child,
            'shirt_length':shirt_length,
            #beauty
            'brand_beaty':brand_beaty,
            'formula':formula,
            'expiry':expiry,
            'body_care':body_care,
            'active_ingredients':active_ingredients,
            'type_of_nutrition':type_of_nutrition,
            'volume':volume,
            'form':form,
            #mobile and tablet
            'sim':sim,
            'brand_mobile_gadgets':brand_mobile_gadgets,
            'warranty_period':warranty_period,
            'ram':ram,
            'memory':memory,
            'status':status,
            'warranty_type':warranty_type,
            'processor':processor,
            'screen':screen,
            'phone_features':phone_features,
            'operating_system':operating_system,
            'telephone_cables':telephone_cables,
            'main_camera':main_camera,
            'camera_selfie':camera_selfie,

            #shoe
            'shoe_brand':shoe_brand,
            'shoe_material':shoe_material,
            'shoe_buckle_type':shoe_buckle_type,
            'leather_outside':leather_outside,
            'marker_style':marker_style,
            'high_heel':high_heel,
            'shoe_occasion':shoe_occasion,
            'shoe_leather_type':shoe_leather_type,
            'shoe_collar_height':shoe_collar_height,
            'suitable_width':suitable_width,

        }
    return render(request, 'vendor/add_item_detail.html', context)


def shipping(request):
    if request.method=="POST":
        shop=request.user.shop
        id=request.POST.get('id')
        form=CheckForm(request.POST)
        if form.is_valid():
            shipping=Shipping.objects.get(id=id)
            shipping.active=form.cleaned_data.get('check')
            if shipping.active==True:
                shipping.shop.add(shop)
                shipping.save()
                return('/')
            else:
                shipping.shop.remove(shop)
                shipping.save()
                return('/')
    else:
        shipping=Shipping.objects.all()
        context={
            'shipping':shipping,
        }
        return render(request, 'vendor/shipping.html', context)
def create_shop(request):
    if request.method == "POST":
        form=ShopForm(request.POST,request.FILES,instance=request.user.shop)
        if form.is_valid():
            form.save()
            shop=Shop.objects.get(user=request.user)
            usr = random.randint(1, 99999999)
            shop.slug=str(form.cleaned_data.get('name')).lower().replace(',', '-').replace(' - ', '-').replace(' ','-') + str(usr)
            shop.save()
            messages.success(request,'ok')
            return redirect('/')
    else:
        form=ShopForm(request.POST,request.FILES)
        return render(request, "vendor/create-shop.html",{'form':form})


import calendar
def my_dashboard(request):
    shop = request.user.shop
    orders = Order.objects.filter(shop=shop,ordered=True,received=True)
    curent_date=timezone.now().date()
    orders=Payment.objects.filter(order__received=True,order__shop=shop).annotate(month=ExtractMonth('timestamp')).values('month').annotate(sum=Sum('amount')).values('month','sum')
    total_order_day=Payment.objects.filter(order__ordered=True,order__shop=shop,timestamp__date__gte=curent_date).annotate(day=TruncHour('timestamp')).values('day').annotate(count=Count('id')).values('day','count')
    total_amount_day=Payment.objects.filter(order__ordered=True,order__shop=shop,timestamp__date__gte=curent_date).annotate(day=TruncHour('timestamp')).values('day').annotate(sum=Sum('amount')).values('day','sum')
    total_amount=Payment.objects.filter(order__ordered=True,order__shop=shop,timestamp__date__gte=curent_date).aggregate(sum=Sum('amount'))

    #result order333333333333333333333333333333333333333333333333333333333333333333333333333333

    result_order =Payment.objects.filter(order__ordered=True,order__shop=shop).aggregate(
        today=Count('id', filter=Q(timestamp__date=curent_date)),
        yesterday=Count('id', filter=Q(timestamp__date=(curent_date - timedelta(hours=24)))),
        last_seven_day=Count('id', filter=Q(timestamp__date=(curent_date - timedelta(days=7)))),
        last_month=Count('id', filter=Q(timestamp__date=(curent_date - timedelta(days=30)))),
    )
    total_amount_days=[]
    total_order_days=[]
    daynumber=[]
    hour = [i for i in range(24)]
    sum=[0 for i in range(24)]
    count=[0 for i in range(24)]
    for i in total_amount_day:
        total_amount_days.append(i['sum'])
        daynumber.append(i['day'].strftime("%I %p"))
        for j in hour:
            if i['day'].strftime("%I %p") ==datetime.time(j).strftime('%I %p'):
                hour[j]=int(i['day'].strftime("%H"))
                sum[j]=int(i['sum'])

    for i in total_order_day:
        total_order_days.append(i['count'])
        daynumber.append(i['day'].strftime("%I %p"))
        for j in hour:
            if i['day'].strftime("%I %p") ==datetime.time(j).strftime('%I %p'):
                hour[j]=int(i['day'].strftime("%H"))
                count[j]=int(i['count'])
    hours=[datetime.time(i).strftime('%H:00') for i in hour]           
    
    # result_amount5555555555555555555555555555555555555555555555555555555555555555

    result_amount =Payment.objects.filter(order__ordered=True,order__shop=shop).aggregate(
        today=Sum('amount', filter=Q(timestamp__date=curent_date)),
        yesterday=Sum('amount', filter=Q(timestamp__date=(curent_date - timedelta(hours=24)))),
        last_seven_day=Sum('amount', filter=Q(timestamp__date=(curent_date - timedelta(days=7)))),
        last_month=Sum('amount', filter=Q(timestamp__date=(curent_date - timedelta(days=30)))),
    )
  
    
    context={
    'total_amount_days':total_amount_days,'total_order_days':total_order_days,'daynumber':daynumber,
    'hours':hours,'sum':sum,'count':count,'total_amount':total_amount,'result_order':result_order,
    'result_amount':result_amount
    }
    return render(request, 'vendor/dashboard.html',context)