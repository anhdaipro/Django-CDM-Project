from django.shortcuts import render,redirect
from .models import *
from product_detail.models import *
import datetime
from order.models import *
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth.mixins import LoginRequiredMixin
from .form import CommentForm,ReviewForm
from django.views.generic.edit import UpdateView, DeleteView
from django.core.paginator import PageNotAnInteger, Paginator
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView, DetailView, View
from account.models import Customer
from django.db.models import Max, Min, Count, Avg,Sum
from django.http import JsonResponse
from django.core import serializers
# Create your views here.


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def product(request,slug):
    item=Item.objects.get(slug=slug)
    
    shop=Shop.objects.filter(item=item.id).first()
    shops=Shop.objects.filter(item=item.id)
    items=Item.objects.filter(shop__in=shops)
    color= Color.objects.filter(variation__item=item.id)
    size= Size.objects.filter(variation__item=item.id)
    user=User.objects.get(shop=shop)
    order=Order.objects.filter(items__product__item=item.id,received=True)
    current_time=timezone.now()
    threads = Thread.objects.prefetch_related('chatmessage_thread').order_by('timestamp')
    price_max=Variation.objects.filter(item=item.id).aggregate(max=Max('price'))
    price_min=Variation.objects.filter(item=item.id).aggregate(min=Min('price'))
    discount_price_max=Variation.objects.filter(item=item.id).aggregate(max=Max('discount_price'))
    discount_price_min=Variation.objects.filter(item=item.id).aggregate(min=Min('discount_price'))
    variant=Variation.objects.filter(item=item.id).aggregate(sum=Sum('inventory'))
    time_off=0
    if item.shop.user.customer.is_online==False:
        time_logout= item.shop.user.customer.time_off
        time_off+=round((current_time-time_logout).seconds/60,0)
    time_us=user.date_joined
    time=(current_time-time_us).days
    item_details=Detail_Item.objects.filter(item=item.id).values()
    item_detailss=Detail_Item.objects.filter(item=item.id)
    item_detail=[entry for entry in item_details]
    context={
        'items':items,
        'item':item,
        'item_detail':item_detail,
        'item_detailss':item_detailss,
        'time':time,
        'Threads': threads,
        'time_off':time_off,
        'order':order,
        'price_max':price_max,
        'price_min':price_min,
        'discount_price_max':discount_price_max,
        'discount_price_min':discount_price_min,
        'color':color,
        'size':size,
        'variant':variant,
    }
    return render(request,'store/product.html',context)



def shop(request,slug):
    shop=Shop.objects.get(slug=slug)
    shops= Shop.objects.filter(slug=slug).first()
    threads = Thread.objects.prefetch_related('chatmessage_thread').order_by('timestamp')
    ip = get_client_ip(request)
    if IpModel.objects.filter(ip=ip).exists():
        shop.view.add(IpModel.objects.get(ip=ip))
    else:
        ip=IpModel.objects.create(ip=ip)
        shop.view.add(IpModel.objects.get(ip=ip))
    context={
        'shop':shop,
        'shops':shops,
        'Threads': threads,
    }
    return render(request,'store/shop.html',context)


def get_price(request):
    try:
        if request.method == 'GET':
            slug=request.GET.get('slug')
            item=Item.objects.get(slug=slug)
            color= request.GET.get('color')
            size=request.GET.get('size')
            if color and size:
                colors=Color.objects.get(name=color)
                sizes=Size.objects.get(name=size)
                product=Variation.objects.get(item=item,size=sizes,color=colors)
                data={
                    'price':product.price,
                    'discout_price':product.discount_price,
                    'inventory':product.inventory,
                    }
                return JsonResponse(data,status=200)
            elif color:
                colors=Color.objects.get(name=color)
                product=Variation.objects.get(item=item,color=colors)
                data={
                    'price':product.price,
                    'discout_price':product.discount_price,
                    'inventory':product.inventory,
                    }
                return JsonResponse(data,status=200)
            elif size:
                sizes=Size.objects.get(name=size)
                product=Variation.objects.get(item=item,size=sizes)
                data={
                    'price':product.price,
                    'discout_price':product.discount_price,
                    'inventory':product.inventory,
                    }
                return JsonResponse(data,status=200)
    except Exception as e:
        return JsonResponse({"error": e}, status=400)
        

@login_required(login_url='/account/signin/')
def like_product(request):
    url = request.META.get('HTTP_REFERER')
    if request.method=='POST':
        like=request.POST.get('like')
        product=Item.objects.get(id=like)
        if request.user in product.liked.all():
            product.liked.remove(request.user)
        else:
            product.liked.add(request.user)
        like_product,created=Like.objects.get_or_create(product=product,user=request.user)
        if not created:
            if like_product.value=="Like":
                like_product.value="Unlike"
            else:
                like_product.value="Like"
        like_product.save()
        return redirect(url)

@login_required(login_url='/account/signin/')
def add_comment(request, id):
    url = request.META.get('HTTP_REFERER')  # refere to the last or current url
    if request.method == 'POST':
        try:
            comment = Comment.objects.get(
                user=request.user.id, product_id=id,parent=None)
            form = CommentForm(request.POST, instance=comment)
            form.save()
            messages.success(
                request, "Thank you! Your comment has been updated.")
            return redirect(url)
        except Exception:
            form = CommentForm(request.POST)
            if form.is_valid():
                data = Comment()
                data.comment = form.cleaned_data['comment']
                data.product_id = id
                data.user = request.user
                data.save()
                messages.success(
                    request, "your comment hass been submitted for your intrest")
                return redirect(url)


class CommentReplyView(LoginRequiredMixin, View):
    def post(self, request,id,pk, *args, **kwargs):
        url = request.META.get('HTTP_REFERER')
        product = Item.objects.get(pk=id)
        parent_comment = Comment.objects.get(pk=pk)
        form = CommentForm(request.POST)
        if form.is_valid():
            data = form.save(commit=False)
            data.user = request.user
            data.product = product
            data.parent = parent_comment
            data.save()
        messages.success(request, "your comment hass been submitted for your intrest")    
        notification = Notification.objects.create(notification_type=2, from_user=request.user, to_user=parent_comment.user, comment=data)
        return redirect(url)

def delete_comment(request):
    # dictionary for initial data with
    # field names as keys
    url = request.META.get('HTTP_REFERER')
    # fetch the object related to passed id
    if request.method=='POST':
        product=request.POST.get('product')
        comment=Comment.objects.get(id=product)
        comment.delete()
        messages.info(request,'your comment had deleted')
        return HttpResponseRedirect(url)
 
class AddCommentLike(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):
        comment = Comment.objects.get(pk=pk)
        is_dislike = False
        for dislike in comment.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break
        if is_dislike:
            comment.dislikes.remove(request.user)
        is_like = False
        for like in comment.likes.all():
            if like == request.user:
                is_like = True
                break
        if not is_like:
            comment.likes.add(request.user)
            notification = Notification.objects.create(notification_type=1, from_user=request.user, to_user=comment.user, comment=comment)
        next = request.POST.get('next', '/')
        return HttpResponseRedirect(next)

class AddCommentDislike(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):
        comment = Comment.objects.get(pk=pk)
        is_like = False
        for like in comment.likes.all():
            if like == request.user:
                is_like = True
                break
        if is_like:
            comment.likes.remove(request.user)
        is_dislike = False
        for dislike in comment.dislikes.all():
            if dislike == request.user:
                is_dislike = True
                break
        if not is_dislike:
            comment.dislikes.add(request.user) 
        next = request.POST.get('next', '/')
        return HttpResponseRedirect(next)

@login_required(login_url='/account/signin/')

def add_review(request):
    url = request.META.get('HTTP_REFERER')
    if request.method=='POST':
        try:
            review = Review.objects.get(
                user=request.user.id, item_id=id)
            form = ReviewForm(request.POST, instance=review)
            form.save()
            messages.success(
                request, "Thank you! Your review has been updated.")
            return redirect(url)
        except Exception:
            form = ReviewForm(request.POST)
            if form.is_valid():
                data = Review()
                data.review_rating = form.cleaned_data['review_rating']
                data.review_text = form.cleaned_data['review_text']
                data.item_id = id
                data.user = request.user
                data.save()
                messages.success(
                    request, "your review hass been submitted tnx for your intrest")
                return redirect(url)
