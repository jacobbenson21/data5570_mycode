from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Person, Country, Recipe
from .serializers import PersonSerializer, CountrySerializer, RecipeSerializer

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
