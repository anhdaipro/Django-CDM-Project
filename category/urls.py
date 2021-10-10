from . import views
from django.urls import path

app_name = 'home'
urlpatterns = [
    path('',views.home, name='home'),
    path('<slug:slug>',views.category, name='category'),
    
    path('follow/<slug>',views.follow, name='follow'),
    
    
]