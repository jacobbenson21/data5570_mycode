from django.db import models
from datetime import timedelta

# -------------------------
# Country Model
# -------------------------
class Country(models.Model):
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

# -------------------------
# Person Model
# -------------------------
class Person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    death_date = models.DateField(blank=True, null=True)

    # External genealogy IDs
    familysearch_id = models.CharField(max_length=20, blank=True, null=True, unique=True)
    ancestry_tree_id = models.CharField(max_length=50, blank=True, null=True)
    ancestry_person_id = models.CharField(max_length=50, blank=True, null=True)

    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name or ''}".strip()

# -------------------------
# Recipe Model
# -------------------------
class Recipe(models.Model):
    title = models.CharField(max_length=200)
    person = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True, related_name="recipes")
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, related_name="recipes")
    description = models.TextField(blank=True, null=True)

    servings = models.PositiveIntegerField(blank=True, null=True)
    prep_time = models.DurationField(blank=True, null=True)
    cook_time = models.DurationField(blank=True, null=True)
    total_time = models.DurationField(blank=True, null=True)
    difficulty = models.CharField(max_length=50, blank=True, null=True)
    meal_type = models.CharField(
        max_length=50,
        choices=[
            ("Breakfast", "Breakfast"),
            ("Lunch", "Lunch"),
            ("Dinner", "Dinner"),
            ("Snack", "Snack"),
            ("Dessert", "Dessert"),
            ("Other", "Other")
        ],
        blank=True,
        null=True
    )
    cuisine_type = models.CharField(max_length=100, blank=True, null=True)

    source_name = models.CharField(max_length=200, blank=True, null=True)
    source_url = models.URLField(blank=True, null=True)

    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    times_cooked = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

# -------------------------
# Ingredient Model
# -------------------------
class Ingredient(models.Model):
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# -------------------------
# RecipeIngredient Model
# -------------------------
class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name="recipes")
    quantity = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.quantity or ''} {self.ingredient.name} for {self.recipe.title}"

# -------------------------
# Memory Model
# -------------------------
class Memory(models.Model):
    title = models.CharField(max_length=200)
    person = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True, related_name="memories")
    recipe = models.ForeignKey(Recipe, on_delete=models.SET_NULL, null=True, blank=True, related_name="memories")
    text = models.TextField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title
