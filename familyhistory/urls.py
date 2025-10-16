from django.urls import path, include
from rest_framework import routers
from .views import (
    CountryViewSet, PersonViewSet, RecipeViewSet,
    IngredientViewSet, RecipeIngredientViewSet, MemoryViewSet
)

router = routers.DefaultRouter()
router.register(r'countries', CountryViewSet)
router.register(r'people', PersonViewSet)
router.register(r'recipes', RecipeViewSet)
router.register(r'ingredients', IngredientViewSet)
router.register(r'recipe-ingredients', RecipeIngredientViewSet)
router.register(r'memories', MemoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
