from django.urls import path
from . import views
from .views import ListvoucherAPI,ListcomboAPI,ListdealshockAPI,ListprogramAPI,ListflashsaleAPI
urlpatterns = [
    
    path("infoseller", views.infoseller),
    path("product/", views.product,name='product'),
    path("vouchers/list", ListvoucherAPI.as_view()),
    path("bundle/list", ListcomboAPI.as_view()),
    path("add-on-deal/list", ListdealshockAPI.as_view()),
    path("list/discount", ListprogramAPI.as_view()),
    path("shop-flash-sale/list", ListflashsaleAPI.as_view()),
    path("product/list", views.get_product,name='get_product'),
    path("product/<int:id>", views.update_item,name='update_item'),
    path("product/update_image", views.update_image,name='update_image'),
    path("product/category", views.add_item,name="add_item"),
    path("product/delete", views.delete_product,name="delete_product"),
    path("shipping/list", views.shipping,name="shipping"),
    path("shipping/shop/list", views.get_shipping),
    path("shop/create", views.create_shop,name="create_shop"),
    path("dashboard", views.my_dashboard,name="dashboard"),
    path('voucher/new',views.voucher),
    path('voucher/<int:id>',views.detail_voucher),
    path("follower-offer/create", views.follower_offer,name="follower_offer"),
    path("shop_award/create", views.shop_award,name="shop_award"),
    path("discount/create", views.new_program),
    path("discount/<int:id>",views.detail_program),
    path("new_combo", views.new_combo),
    path("combo/<int:id>", views.detail_combo),
    path("flashsale/create", views.new_flashsale),
    path("flashsale/<int:id>", views.detail_flashsale),
    path("new_deal", views.new_deal),
    path('deal_shock/<int:id>',views.deal_shock,name="item_deal_shock"),
    
]