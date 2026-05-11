from django.shortcuts import render

# Create your views here.
# api/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product,Order,OrderItem
from .serializers import ProductSerializer
## creaete register api




from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password

from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from django.db import IntegrityError


@api_view(['GET'])
def home(request):
    return Response({"message": "Welcome to Grocery API"})

@api_view(['GET', 'POST'])
def product_list(request):

    # GET → return all products
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    # POST → create new product
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    



@api_view(['GET'])
def product_detail(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    serializer = ProductSerializer(product)
    return Response(serializer.data)    



from rest_framework import status  # Good practice to use status constants

@api_view(['POST'])
def register_user(request):
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # 1. Validation for missing fields
    if not username or not password:
        return Response(
            {"error": "Username and password are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # 2. Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 3. Check if email already exists
    if email and User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 4. Create User
    try:
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        return Response(
            {"message": "User created successfully"}, 
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




from django.views.decorators.csrf import csrf_exempt # Import this

@csrf_exempt # Add this to bypass the CSRF check for this API
@api_view(['POST']) 
def login_user(request):
    username = request.data.get('username') # match your JSON key
    password = request.data.get('password')
    
    # Use authenticate to check both username and password
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    else:
        return Response({"error": "Invalid username or password"}, status=401)
    
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You are logged in"})






from .models import CartItem




from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CartItem, Product

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)

    product = Product.objects.get(id=product_id)

    cart_item, created = CartItem.objects.get_or_create(
        user=user,
        product=product,
        is_ordered=False
    )

    if not created:
        cart_item.quantity += int(quantity)
    else:
        cart_item.quantity = quantity

    cart_item.save()

    return Response({"message": "Added to cart"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    user = request.user
    cart_items = CartItem.objects.filter(user=user)
    data = []
    total_price = 0

    for item in cart_items:
        item_total = item.product.price * item.quantity
        total_price += item_total

        data.append({
            "id": item.id,  # <--- ADD THIS LINE
            "product": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "total": item_total
        })

    return Response({"cart": data, "total_price": total_price})



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    user = request.user
    product_id = request.data.get('product_id')

    try:
        cart_item = CartItem.objects.get(user=user, product_id=product_id)
        cart_item.delete()
        return Response({"message": "Item removed from cart"})
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)
    



from django.shortcuts import get_object_or_404

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart(request):
    cart_id = request.data.get("cart_id")
    quantity = request.data.get("quantity")

    cart_item = get_object_or_404(
        CartItem,
        id=cart_id,
        user=request.user
    )

    if int(quantity) <= 0:
        cart_item.delete()
        return Response({"message": "deleted"})

    cart_item.quantity = int(quantity)
    cart_item.save()

    return Response({"message": "updated"})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def bulk_update_cart(request):
    user=request.user
    items=request.data.get('items',[])


    if not items:
        return Response({"error":"No items provided"},status=400)
    
    for item in items:
        product_id=item.get('product_id')
        quantity=item.get('quantity')
        if not product_id or not quantity:
            continue


        try:
            cart_item = CartItem.objects.get(user=user, product_id=product_id)
            cart_item.quantity = quantity
            cart_item.save()
        except CartItem.DoesNotExist:
            continue

    return Response({"message": "Cart updated successfully"})




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    user = request.user
    cart_items = CartItem.objects.filter(user=user)

    if not cart_items:
        return Response({"error": "Cart is empty"}, status=400)

    total_price = 0

    order = Order.objects.create(user=user, total_price=0)

    for item in cart_items:
        item_total = item.product.price * item.quantity
        total_price += item_total

        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    order.total_price = total_price
    order.save()

    cart_items.delete()  # clear cart after order

    return Response({
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_price": total_price
    })



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    orders = Order.objects.filter(user=request.user)

    data = []

    for order in orders:
        items = order.items.all()

        data.append({
            "id": order.id,
            "status": order.status,
            "total_price": order.total_price,
            "payment_status": order.payment_status,
            "items": [
                {
                    "product": i.product.name,
                    "quantity": i.quantity,
                    "price": i.price
                } for i in items
            ]
        })

    return Response(data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, id):
    try:
        order = Order.objects.get(id=id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    items = []

    for item in order.items.all():
        items.append({
            "product": item.product.name,
            "quantity": item.quantity,
            "price": item.price
        })

    return Response({
        "order_id": order.id,
        "total_price": order.total_price,
        "status": order.status,
        "payment_status": order.payment_status,
        "items": items
    })







@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_status(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    # Optional: restrict to admin
    # if not request.user.is_staff:
    #     return Response({"error": "Not allowed"}, status=403)

    new_status = request.data.get('status')

    if new_status not in ['pending', 'processing', 'shipped', 'delivered']:
        return Response({"error": "Invalid status"}, status=400)

    order.status = new_status
    order.save()

    return Response({"message": "Order status updated"})





###    PAYMENT API

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_payment(request, id):
    try:
        order = Order.objects.get(id=id, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    if order.payment_status:
        return Response({"message": "Already paid"})

    # simulate payment success
    order.payment_status = True
    order.status = "processing"
    order.save()

    return Response({
        "message": "Payment successful",
        "order_id": order.id
    })