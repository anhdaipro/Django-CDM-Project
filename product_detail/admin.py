from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Screen)
admin.site.register(Memory)
admin.site.register(Ram)
admin.site.register(Warranty_type)
admin.site.register(Warranty_period)
admin.site.register(Status)
admin.site.register(Sim)
admin.site.register(Battery)
admin.site.register(Operating_System)
admin.site.register(Brand_Mobile_Gadgets)
admin.site.register(Phone_Features)
admin.site.register(Telephone_cables)
admin.site.register(Processor)
admin.site.register(MainCamera)
admin.site.register(CameraSelfie)

# Register your models here.
admin.site.register(Style)
admin.site.register(Brand_Clothes)
admin.site.register(Buckle_type)
admin.site.register(Waist_version)
admin.site.register(Material)
admin.site.register(Origin)
admin.site.register(Pants_length)
admin.site.register(Pants_style)
admin.site.register(Pants_pattern)

#dress
admin.site.register(Dress_Style)
admin.site.register(Shirt_length)

admin.site.register(Skirt_length)

admin.site.register(Occasion)
admin.site.register(Season)
admin.site.register(Sample)
admin.site.register(Collar)
admin.site.register(Sleeve_lenght)

admin.site.register(Short_type)
admin.site.register(Type_lock)
#beauty
admin.site.register(Brand_Beaty)

admin.site.register(Expiry)
admin.site.register(Formula)
admin.site.register(Type_of_nutrition)
admin.site.register(Active_Ingredients)
admin.site.register(Body_care)
admin.site.register(Volume)


admin.site.register(Detail_Item)