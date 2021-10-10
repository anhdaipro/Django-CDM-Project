from django.shortcuts import render,redirect
from shops.models import Shop,Variation,Item,Follow
from collections import namedtuple
from .models import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import redirect, render

from django.views import generic


from django.http.response import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.utils import timezone

from django.views.generic import ListView, DetailView, View
from django.db.models import Max, Min, Count, Avg


from django.views.generic.edit import UpdateView, DeleteView
from django.core.paginator import PageNotAnInteger, Paginator
from django.contrib.auth.decorators import login_required
from datetime import datetime,date
from datetime import date
# Create your views here.
def home(request):
    category=Category.objects.filter(parent=None)
   
    context={
        'category':category,
        
    }
    return render(request,'store/home.html',context)


def category(request,slug):
    category=Category.objects.get(slug=slug,parent=None)
    chilren=category.get_descendants(include_self=False)
    
    context={
        'category':category,
        'chilren':chilren,
    }
    return render(request,'store/category.html',context)


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@login_required(login_url='/account/signin/')
def follow(request,slug):
    url = request.META.get('HTTP_REFERER')
    if request.method=='POST':
        
        shop=Shop.objects.get(slug=slug)
        if request.user in shop.followers.all():
            shop.followers.remove(request.user)
        else:
            shop.followers.add(request.user)
        follow,created=Follow.objects.get_or_create(shop=shop,user=request.user)
        if not created:
            if follow.value=="Follow":
                follow.value="Unfollow"
            else:
                follow.value="Follow"
        follow.save()
        return redirect(url)