from django.contrib import admin
from .models import DeliveryPerson, DeliveryAssignment

admin.site.register(DeliveryPerson)
admin.site.register(DeliveryAssignment)