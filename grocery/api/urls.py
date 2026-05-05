from django.urls import path
from .views import product_list,home,product_detail
from .views import register_user,login_user




urlpatterns = [
    path('', home), 
    path('products/', product_list),
    path('products/<int:id>/', product_detail),
    path('register/', register_user),
    path('login/', login_user),
]

