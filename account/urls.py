from django.contrib.auth import logout
from . import views
from django.urls import path
from .views import (SingnupView,CustomerView)
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from django.conf import settings

app_name = 'app_user'
urlpatterns = [
    path('signup/',SingnupView.as_view(),name='signup'),
    path('login/',views.login_view,name='signin') ,
    path('logout/',views.logout_view,name='logout'),
    path('resendOTP/',views.resend_otp,name='resend_otp'),
    #path('activate/<uidb64>/<token>', views.activate, name='activate'),
    #path('order/',OrderSuccess.as_view(),name='order_success'),
    #path('cancel/',RequestCanCelView.as_view(),name='cancel'),'''
    path('profile/',views.CustomerView.as_view(),name='profile'),
    #path('address/',views.address,name='address'),
    #path('address/delete/',views.delete_address,name='delete'),
    #path('address/update/<int:id>',views.update_address,name='update'),
    #path('address/add',views.add_address,name='add'),'''
    path('password',views.change_password,name='change_password'),
    
    ]
