// --- File: components/RecipeListItem.jsx ---
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { deleteRecipe } from '../app/store';

// CHILD Component
export default function RecipeList({ recipe }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePress = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  const handleDelete = () => {
    // Use window.confirm for web compatibility
    const confirmed = window.confirm(`Are you sure you want to delete "${recipe.title}"?`);
    
    if (confirmed) {
      dispatch(deleteRecipe(recipe.id));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.recipeContent}
      >
        <Text style={styles.title}>{recipe.title}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>

      {/* Commented out Edit button for now */}
      {/* <TouchableOpacity
        onPress={() => router.push(`/recipes/edit/${recipe.id}`)}
        style={styles.editButton}
      >
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  recipeContent: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Styles for edit button when you're ready to use it
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
  },
});