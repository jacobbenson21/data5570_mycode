// --- File: app/recipes/[id].jsx ---
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteRecipe, deleteRecipeIngredientsByRecipe, incrementTimesCooked } from '../store';
import RecipeIngredients from '../../components/RecipeIngredients';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams(); 
  const dispatch = useDispatch();
  const router = useRouter();

  const recipes = useSelector(state => state.recipes?.items || []);
  
  const recipe = useMemo(() => {
    return recipes.find(r => String(r.id) === String(id));
  }, [recipes, id]);

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    // Handle both duration format (HH:MM:SS) and minutes number
    if (typeof timeString === 'number') {
      const hours = Math.floor(timeString / 60);
      const minutes = timeString % 60;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }
    // Parse duration string like "0:15:00"
    const parts = timeString.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }
    return timeString;
  };

  const people = useSelector((state) => state.people?.items || []);
  const countries = useSelector((state) => state.countries?.items || []);
  
  if (!recipe) return <Text style={styles.notFound}>Recipe not found</Text>;
  
  const person = recipe.person ? people.find(p => p.id === recipe.person) : null;
  const country = recipe.country ? countries.find(c => c.id === recipe.country) : null;

  const handleDelete = async () => {
    // Use window.confirm for web compatibility
    const confirmed = window.confirm(`Are you sure you want to delete "${recipe.title}"?`);
    
    if (confirmed) {
      try {
        // Delete recipe ingredients first
        await dispatch(deleteRecipeIngredientsByRecipe(recipe.id)).unwrap();
        // Then delete the recipe
        await dispatch(deleteRecipe(recipe.id)).unwrap();
        router.replace('/');
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.detailsContainer}>
        <View style={styles.editButtonWrapper}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`/recipes/edit/${id}`)}
          >
            <Text style={styles.editButtonText}>Edit Recipe</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.title}>{recipe.title}</Text>
        
        {/* Recipe Metadata */}
        <View style={styles.metadataRow}>
          <Text style={styles.metadataText}>🍽 Servings: {recipe.servings || 'N/A'}</Text>
          <Text style={styles.metadataText}>⏳ Prep: {formatTime(recipe.prep_time)}</Text>
          <Text style={styles.metadataText}>🔥 Cook: {formatTime(recipe.cook_time)}</Text>
        </View>

        {recipe.total_time && (
          <Text style={styles.metadataText}>⏱️ Total: {formatTime(recipe.total_time)}</Text>
        )}

        {person && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>👤 Family Member:</Text>
            <Text style={styles.infoText}>{person.first_name} {person.last_name || ''}</Text>
          </View>
        )}

        {country && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>🌍 Country:</Text>
            <Text style={styles.infoText}>{country.name}{country.region ? ` (${country.region})` : ''}</Text>
          </View>
        )}

        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.descriptionText}>
          {recipe.description || 'No description provided.'}
        </Text>

        {recipe.meal_type && (
          <>
            <Text style={styles.sectionHeader}>Meal Type</Text>
            <Text style={styles.infoText}>{recipe.meal_type}</Text>
          </>
        )}

        {recipe.cuisine_type && (
          <>
            <Text style={styles.sectionHeader}>Cuisine Type</Text>
            <Text style={styles.infoText}>{recipe.cuisine_type}</Text>
          </>
        )}

        {recipe.difficulty && (
          <>
            <Text style={styles.sectionHeader}>Difficulty</Text>
            <Text style={styles.infoText}>{recipe.difficulty}</Text>
          </>
        )}

        {recipe.source_name && (
          <>
            <Text style={styles.sectionHeader}>Source</Text>
            <Text style={styles.infoText}>{recipe.source_name}</Text>
            {recipe.source_url && (
              <Text style={styles.linkText} onPress={() => {/* Open URL */}}>{recipe.source_url}</Text>
            )}
          </>
        )}

        {recipe.rating && (
          <>
            <Text style={styles.sectionHeader}>Rating</Text>
            <Text style={styles.infoText}>⭐ {recipe.rating}/5</Text>
          </>
        )}

        <View style={styles.timesCookedContainer}>
          <Text style={styles.sectionHeader}>Times Cooked</Text>
          <View style={styles.timesCookedRow}>
            <Text style={styles.infoText}>
              {recipe.times_cooked || 0} time{(recipe.times_cooked || 0) !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity
              style={styles.cookedButton}
              onPress={async () => {
                try {
                  await dispatch(incrementTimesCooked(recipe.id)).unwrap();
                } catch (error) {
                  console.error('Error incrementing times cooked:', error);
                }
              }}
            >
              <Text style={styles.cookedButtonText}>🍳 I Cooked This!</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Ingredients</Text>
        <RecipeIngredients recipeId={recipe.id} isEditable={false} />
        </View>
      </ScrollView>

      {/* 2. WRAPPER FOR BUTTON: Pushed to the bottom by Flexbox */}
      <View style={styles.deleteButtonWrapper}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => {
            console.log('Button pressed!');
            handleDelete();
          }}
        >
          <Text style={styles.deleteButtonText}>Delete Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
    // 🚀 CRITICAL FLEXBOX CHANGE: Pushes the two main children (detailsContainer and deleteButtonWrapper) to opposite ends.
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
  },
  notFound: {
    padding: 20,
    fontSize: 18,
    color: 'red',
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 15
  },
  editButtonWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  metadataText: {
    fontSize: 14,
    color: '#555',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16, 
    lineHeight: 24, 
    color: '#333'
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    fontSize: 14,
    color: '#2196F3',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  timesCookedContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  timesCookedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cookedButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cookedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // 🚀 FIXED STYLE NAME and added padding for aesthetics
  deleteButtonWrapper: { 
    paddingVertical: 10,
    marginBottom: 10, 
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});