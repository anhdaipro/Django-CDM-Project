from django.contrib import admin

import admin_thumbnails

from mptt.admin import DraggableMPTTAdmin
from .models import *
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title','parent', 'status']
    list_filter = ['status']
    
admin.site.register(Category)
