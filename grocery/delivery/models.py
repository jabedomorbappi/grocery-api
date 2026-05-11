from django.db import models
from django.contrib.auth.models import User
from api.models import Order



class DeliveryPerson(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    phone = models.CharField(max_length=20)

    current_lat = models.FloatField(null=True, blank=True)
    current_lng = models.FloatField(null=True, blank=True)

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username

   
    
class DeliveryAssignment(models.Model):
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE
    )

    delivery_person = models.ForeignKey(
        DeliveryPerson,
        on_delete=models.CASCADE
    )

    assigned_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        default='assigned'
    )

    def __str__(self):
        return f"Order {self.order.id} → {self.delivery_person.user.username}"
