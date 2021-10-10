from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Shop)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['id','name','description']

class ShippingAdmin(admin.ModelAdmin):
    list_display = ['id','active']
class VariationAdmin(admin.ModelAdmin):
    list_display = ['item','id','color','size','price','inventory']
class CommentAdmin(admin.ModelAdmin):
    list_display=['user','comment','parent']

class ThreadAdmin(admin.ModelAdmin):
    list_display=['first_person','second_person']

admin.site.register(Item,ItemAdmin)
admin.site.register(Variation,VariationAdmin)
admin.site.register(Color)
admin.site.register(Size)
admin.site.register(Shipping,ShippingAdmin)
admin.site.register(Like)
admin.site.register(Comment,CommentAdmin)
admin.site.register(Notification)
admin.site.register(Review)
admin.site.register(IpModel)
admin.site.register(Thread,ThreadAdmin)
admin.site.register(ChatMessage)

