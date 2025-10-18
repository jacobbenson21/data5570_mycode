// --- File: app/recipes/[id].jsx ---
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteRecipe } from '../store';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams(); 
  const dispatch = useDispatch();
  const router = useRouter();

  // FIX: Separate useSelector from useMemo
  const recipes = useSelector(state => state.recipes || []);
  
  const recipe = useMemo(() => {
    return recipes.find(r => String(r.id) === String(id));
  }, [recipes, id]);

  const formatTime = (timeInMinutes) => {
    if (!timeInMinutes || timeInMinutes === 0) return 'N/A';
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (!recipe) return <Text style={styles.notFound}>Recipe not found</Text>;

  const handleDelete = () => {
    // Use window.confirm for web compatibility
    const confirmed = window.confirm(`Are you sure you want to delete "${recipe.title}"?`);
    
    if (confirmed) {
      console.log('Delete confirmed, dispatching action...');
      dispatch(deleteRecipe(recipe.id));
      console.log('Action dispatched, navigating...');
      router.replace('/'); 
    } else {
      console.log('Delete cancelled');
    }
  };

  return (
    // CRITICAL: The main container must manage vertical space
    <View style={styles.container}>
      
      {/* 1. WRAPPER FOR ALL SCROLLABLE/TOP CONTENT */}
      <View style={styles.detailsContainer}>

        {/* ADDING EDIT BUTTON */}
        {/* <View style={styles.editButtonWrapper}>
            <Button
                title="Edit Recipe"
                onPress={() => router.push(`/recipes/edit/${id}`)}
            />
        </View> */}
        
        <Text style={styles.title}>{recipe.title}</Text>
        
        {/* Recipe Metadata */}
        <View style={styles.metadataRow}>
          <Text style={styles.metadataText}>🍽 Servings: {recipe.servings || 'N/A'}</Text>
          <Text style={styles.metadataText}>⏳ Prep: {formatTime(recipe.prepTime)}</Text>
          <Text style={styles.metadataText}>🔥 Cook: {formatTime(recipe.cookTime)}</Text>
        </View>

        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.descriptionText}>
          {recipe.description || 'No description provided.'}
        </Text>

        {/* Placeholders */}
        <Text style={styles.sectionHeader}>Ingredients</Text>
        <Text style={styles.placeholderText}>[Ingredient List Component Placeholder]</Text>

        <Text style={styles.sectionHeader}>Meal Type</Text>
        <Text style={styles.placeholderText}>{recipe.mealType || 'N/A'}
        </Text>
      </View> {/* END detailsContainer */}

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
  // 🆕 NEW STYLE: Holds all content except the button. It ensures the content takes space at the top.
  detailsContainer: {
    // We don't need 'flex: 1' here if the container has it and uses space-between, 
    // but it helps ensure the content scrolls if it gets too long.
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
    marginBottom: 10,
    width: 120,
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