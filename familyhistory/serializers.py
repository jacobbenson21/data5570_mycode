from rest_framework import serializers
from .models import Person, Country, Recipe

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True)
    country = CountrySerializer(read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'
