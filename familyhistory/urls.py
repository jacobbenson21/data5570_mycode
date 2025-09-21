from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonViewSet, CountryViewSet, RecipeViewSet

router = DefaultRouter()
router.register(r'persons', PersonViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'recipes', RecipeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
