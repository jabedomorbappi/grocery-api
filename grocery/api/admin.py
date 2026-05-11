
from django.contrib import admin

###--------------Import all of my Models or table 


from .models import (Product,CartItem,Order,OrderItem)






# ----------------------------register alll of the models or table 

admin.site.register(Product)


admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)