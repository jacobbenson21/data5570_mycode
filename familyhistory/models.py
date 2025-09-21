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
# Person / Ancestor Model
# -------------------------
class Person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    death_date = models.DateField(blank=True, null=True)

    # External genealogy IDs
    familysearch_id = models.CharField(max_length=10, blank=True, null=True, unique=True)
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
    person = models.ForeignKey(
        'Person',  # Use quotes for lazy reference
        on_delete=models.SET_NULL,
        null=True,
        related_name='recipes'
    )
    country = models.ForeignKey(
        'Country',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recipes'
    )
    description = models.TextField(blank=True, null=True)

    # Serving details
    servings = models.PositiveIntegerField(blank=True, null=True)
    prep_time = models.DurationField(blank=True, null=True)
    cook_time = models.DurationField(blank=True, null=True)
    total_time = models.DurationField(blank=True, null=True)

    # Categorization
    difficulty = models.CharField(
        max_length=20,
        choices=[("Easy","Easy"), ("Medium","Medium"), ("Hard","Hard")],
        blank=True,
        null=True
    )
    meal_type = models.CharField(
        max_length=50,
        choices=[
            ("Breakfast","Breakfast"),
            ("Lunch","Lunch"),
            ("Dinner","Dinner"),
            ("Snack","Snack"),
            ("Dessert","Dessert"),
            ("Other","Other")
        ],
        blank=True,
        null=True
    )
    cuisine_type = models.CharField(max_length=100, blank=True, null=True)

    # Attribution
    source_name = models.CharField(max_length=200, blank=True, null=True)
    source_url = models.URLField(blank=True, null=True)

    # Popularity / tracking
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    times_cooked = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
