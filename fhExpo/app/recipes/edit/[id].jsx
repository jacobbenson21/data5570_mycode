// --- File: app/recipes/edit/[id].jsx ---
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateRecipe } from '../../store';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; 
import { MEAL_TYPE_CHOICES } from '../../../constants/data'; 

export default function EditRecipe() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  // Get all recipes from Redux store
  const recipes = useSelector(state => state.recipes || []);
  
  // Find the specific recipe to edit
  const recipe = recipes.find(r => String(r.id) === String(id));

  // Initialize all state with empty defaults
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [mealType, setMealType] = useState(null);

  // Load recipe data into state when component mounts or recipe changes
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setDescription(recipe.description || '');
      setServings(recipe.servings ? String(recipe.servings) : '');
      setPrepTime(recipe.prepTime ? String(recipe.prepTime) : '');
      setCookTime(recipe.cookTime ? String(recipe.cookTime) : '');
      setMealType(recipe.mealType || null);
    }
  }, [recipe]);

  // Show error if recipe not found
  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Recipe not found for editing.</Text>
      </View>
    );
  }

  // Handle save button press
  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      return; // Don't save if required fields are empty
    }

    // Helper to safely convert string to number
    const toNumber = (value) => {
      if (!value || value.trim() === '') return null;
      const num = parseInt(value, 10);
      return isNaN(num) ? null : num;
    };

    // Build updated recipe object
    const updatedRecipe = {
      id: recipe.id,
      title: title.trim(),
      description: description.trim(),
      servings: toNumber(servings),
      prepTime: toNumber(prepTime),
      cookTime: toNumber(cookTime),
      mealType: mealType,
      personId: recipe.personId || null,
      sourceName: recipe.sourceName || null,
      rating: recipe.rating || null,
    };

    // Dispatch update action and navigate back
    dispatch(updateRecipe(updatedRecipe));
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.flex} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        style={styles.container}
      >
        <Text style={styles.header}>Edit Recipe</Text>
        
        <Text style={styles.label}>Title *</Text>
        <TextInput 
          value={title} 
          onChangeText={setTitle} 
          placeholder="Enter recipe title" 
          style={styles.input} 
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput 
          value={description} 
          onChangeText={setDescription} 
          placeholder="Enter recipe description" 
          multiline 
          numberOfLines={4}
          style={[styles.input, styles.multilineInput]} 
        />

        <Text style={styles.label}>Servings</Text>
        <TextInput
          value={servings}
          onChangeText={(text) => setServings(text.replace(/[^0-9]/g, ''))}
          placeholder="e.g., 4" 
          keyboardType="numeric" 
          style={styles.input} 
        />

        <Text style={styles.label}>Prep Time (minutes)</Text>
        <TextInput 
          value={prepTime} 
          onChangeText={(text) => setPrepTime(text.replace(/[^0-9]/g, ''))} 
          placeholder="e.g., 15" 
          keyboardType="numeric" 
          style={styles.input} 
        />

        <Text style={styles.label}>Cook Time (minutes)</Text>
        <TextInput 
          value={cookTime} 
          onChangeText={(text) => setCookTime(text.replace(/[^0-9]/g, ''))} 
          placeholder="e.g., 30" 
          keyboardType="numeric" 
          style={styles.input} 
        />
        
        <Text style={styles.label}>Meal Type</Text>
        <View style={styles.pickerContainer}> 
          <Picker
            selectedValue={mealType}
            onValueChange={(itemValue) => setMealType(itemValue)}
          >
            {MEAL_TYPE_CHOICES.map((item) => (
              <Picker.Item 
                key={item.value} 
                label={item.label} 
                value={item.value} 
              />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            disabled={!title.trim() || !description.trim()} 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { 
    flex: 1 
  },
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: { 
    paddingBottom: 40 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: { 
    marginTop: 20,
    marginBottom: 20,
  },
  pickerContainer: { 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  notFound: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});