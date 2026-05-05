from django.urls import path
from .views import product_list,home,product_detail
from .views import register_user,login_user,protected_view,remove_from_cart,update_cart,bulk_update_cart

from .views import add_to_cart, view_cart
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path('', home), 
    path('products/', product_list),
    path('products/<int:id>/', product_detail),
    path('register/', register_user),
    path('login/', login_user),
    path('protected/', protected_view),

    path('cart/add/', add_to_cart),
    path('cart/', view_cart),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('cart/remove/', remove_from_cart),
    path('cart/update/', update_cart),
    path('cart/bulk-update/', bulk_update_cart),
   
]




