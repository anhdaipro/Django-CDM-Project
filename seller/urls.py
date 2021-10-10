from django.contrib.auth import views as auth_views
from django.urls import path

from . import views
app_name='vendor'

urlpatterns = [
    path("", views.index,name='index'),
    path("login/", views.login_vendor,name="login_vendor"),
    path("add-item/", views.add_item,name="add_item"),
    path("add-item-detail/", views.add_item_detail,name="add_item_detail"),
    path("shipping/", views.shipping,name="shipping"),
    path("create-shop/", views.create_shop,name="create_shop"),
    path("dashboard/", views.my_dashboard,name="dashboard"),
    
]