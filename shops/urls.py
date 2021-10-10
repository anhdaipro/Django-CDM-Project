from django.urls import path

from . import views
app_name='shops'

urlpatterns = [
    path("product/<slug>", views.product,name='product'),
    path("product/like_product/", views.like_product,name='like_product'),
    path('review/<int:id>', views.add_review, name='review'),
    path('product/aaaa/aaa', views.get_price, name='get_price'),
    path('<slug:slug>/',views.shop, name='shop'),
]