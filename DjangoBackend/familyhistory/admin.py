from django.contrib import admin
from .models import Country, Person, Recipe, Ingredient, RecipeIngredient, Memory

admin.site.register(Country)
admin.site.register(Person)
admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(RecipeIngredient)
admin.site.register(Memory)

# Register your models here.
