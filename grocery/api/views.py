from django.shortcuts import render

# Create your views here.
# api/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
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