from django.urls import path
from . import consumers


websocket_urlpatterns = [
    path('product/<slug>', consumers.ChatConsumer.as_asgi()),
    path('<slug:slug>/', consumers.ChatConsumer.as_asgi()),
]