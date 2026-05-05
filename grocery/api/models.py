from django.db import models

# Create your models here.


from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()

    def __str__(self):
        return self.name


from django.contrib.auth.models import User

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    is_ordered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"