// --- File: components/RecipeListItem.jsx ---
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipe } from '../app/store';

// CHILD Component
export default function RecipeList({ recipe }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const people = useSelector((state) => state.people?.items || []);
  const countries = useSelector((state) => state.countries?.items || []);

  const handlePress = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  const handleDelete = async () => {
    // Use window.confirm for web compatibility
    const confirmed = window.confirm(`Are you sure you want to delete "${recipe.title}"?`);
    
    if (confirmed) {
      try {
        await dispatch(deleteRecipe(recipe.id)).unwrap();
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const person = recipe.person ? people.find(p => p.id === recipe.person) : null;
  const country = recipe.country ? countries.find(c => c.id === recipe.country) : null;

  const formatTime = (timeString) => {
    if (!timeString) return null;
    if (typeof timeString === 'number') {
      const hours = Math.floor(timeString / 60);
      const minutes = timeString % 60;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }
    const parts = timeString.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.recipeContent}
      >
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.metadata}>
          {recipe.meal_type && (
            <Text style={styles.metadataText}>🍽 {recipe.meal_type}</Text>
          )}
          {recipe.servings && (
            <Text style={styles.metadataText}>👥 {recipe.servings} servings</Text>
          )}
          {formatTime(recipe.prep_time) && (
            <Text style={styles.metadataText}>⏳ {formatTime(recipe.prep_time)}</Text>
          )}
          {recipe.rating && (
            <Text style={styles.metadataText}>⭐ {recipe.rating}/5</Text>
          )}
        </View>
        {(person || country) && (
          <View style={styles.attribution}>
            {person && (
              <Text style={styles.attributionText}>👤 {person.first_name} {person.last_name || ''}</Text>
            )}
            {country && (
              <Text style={styles.attributionText}>🌍 {country.name}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  recipeContent: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  attribution: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  attributionText: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});