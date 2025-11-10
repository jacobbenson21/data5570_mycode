// --- File: app/recipes/edit/[id].jsx ---
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateRecipe } from '../../store';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; 
import { MEAL_TYPE_CHOICES, DIFFICULTY_CHOICES } from '../../../constants/data';
import RecipeIngredients from '../../../components/RecipeIngredients';
import { validateRequired, validateURL, validateRating, validatePositiveNumber } from '../../../utils/validation'; 

export default function EditRecipe() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  // Get all recipes, people, and countries from Redux store
  const recipes = useSelector(state => state.recipes?.items || []);
  const people = useSelector(state => state.people?.items || []);
  const countries = useSelector(state => state.countries?.items || []);
  
  // Find the specific recipe to edit
  const recipe = recipes.find(r => String(r.id) === String(id));

  // Initialize all state with empty defaults
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [mealType, setMealType] = useState(null);
  const [cuisineType, setCuisineType] = useState('');
  const [difficulty, setDifficulty] = useState(null);
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [rating, setRating] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errors, setErrors] = useState({});

  // Helper to parse duration string to minutes
  const parseDuration = (durationStr) => {
    if (!durationStr) return '';
    if (typeof durationStr === 'number') return String(durationStr);
    // Parse "0:15:00" format
    const parts = durationStr.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      return String(hours * 60 + minutes);
    }
    return '';
  };

  // Load recipe data into state when component mounts or recipe changes
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setDescription(recipe.description || '');
      setServings(recipe.servings ? String(recipe.servings) : '');
      setPrepTime(parseDuration(recipe.prep_time));
      setCookTime(parseDuration(recipe.cook_time));
      setMealType(recipe.meal_type || null);
      setCuisineType(recipe.cuisine_type || '');
      setDifficulty(recipe.difficulty || null);
      setSourceName(recipe.source_name || '');
      setSourceUrl(recipe.source_url || '');
      setRating(recipe.rating ? String(recipe.rating) : '');
      setSelectedPerson(recipe.person || null);
      setSelectedCountry(recipe.country || null);
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    const titleError = validateRequired(title, 'Title');
    if (titleError) newErrors.title = titleError;
    
    if (sourceUrl) {
      const urlError = validateURL(sourceUrl);
      if (urlError) newErrors.sourceUrl = urlError;
    }
    
    if (rating) {
      const ratingError = validateRating(rating);
      if (ratingError) newErrors.rating = ratingError;
    }
    
    if (servings) {
      const servingsError = validatePositiveNumber(servings, 'Servings');
      if (servingsError) newErrors.servings = servingsError;
    }
    
    if (prepTime) {
      const prepTimeError = validatePositiveNumber(prepTime, 'Prep time');
      if (prepTimeError) newErrors.prepTime = prepTimeError;
    }
    
    if (cookTime) {
      const cookTimeError = validatePositiveNumber(cookTime, 'Cook time');
      if (cookTimeError) newErrors.cookTime = cookTimeError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save button press
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    // Build updated recipe object matching the add recipe format
    const updatedRecipe = {
      title: title.trim(),
      description: description || null,
      servings: servings ? parseInt(servings) : null,
      prep_time: prepTime ? `0:${prepTime}:00` : null,
      cook_time: cookTime ? `0:${cookTime}:00` : null,
      total_time: (prepTime && cookTime) ? `0:${parseInt(prepTime) + parseInt(cookTime)}:00` : null,
      meal_type: mealType || null,
      cuisine_type: cuisineType || null,
      difficulty: difficulty || null,
      source_name: sourceName || null,
      source_url: sourceUrl || null,
      rating: rating ? parseFloat(rating) : null,
      times_cooked: recipe.times_cooked !== undefined ? recipe.times_cooked : 0,
      person: selectedPerson,
      country: selectedCountry,
    };

    try {
      // Dispatch update action and navigate back
      await dispatch(updateRecipe({ id: recipe.id, data: updatedRecipe })).unwrap();
      router.back();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
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
        
        <Text style={styles.label}>Title: *</Text>
        <TextInput 
          value={title} 
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) setErrors({ ...errors, title: null });
          }}
          placeholder="Enter recipe title" 
          style={[styles.input, errors.title && styles.inputError]} 
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        <Text style={styles.label}>Description:</Text>
        <TextInput 
          value={description} 
          onChangeText={setDescription} 
          placeholder="Enter recipe description" 
          multiline 
          style={[styles.input, styles.multilineInput]} 
        />

        <Text style={styles.label}>Servings:</Text>
        <TextInput
          value={servings}
          onChangeText={(text) => {
            setServings(text.replace(/[^0-9]/g, ''));
            if (errors.servings) setErrors({ ...errors, servings: null });
          }}
          placeholder="e.g., 4" 
          keyboardType="numeric" 
          style={[styles.input, errors.servings && styles.inputError]} 
        />
        {errors.servings && <Text style={styles.errorText}>{errors.servings}</Text>}

        <Text style={styles.label}>Prep Time (minutes):</Text>
        <TextInput 
          value={prepTime} 
          onChangeText={(text) => {
            setPrepTime(text.replace(/[^0-9]/g, ''));
            if (errors.prepTime) setErrors({ ...errors, prepTime: null });
          }}
          placeholder="e.g., 15" 
          keyboardType="numeric" 
          style={[styles.input, errors.prepTime && styles.inputError]} 
        />
        {errors.prepTime && <Text style={styles.errorText}>{errors.prepTime}</Text>}

        <Text style={styles.label}>Cook Time (minutes):</Text>
        <TextInput 
          value={cookTime} 
          onChangeText={(text) => {
            setCookTime(text.replace(/[^0-9]/g, ''));
            if (errors.cookTime) setErrors({ ...errors, cookTime: null });
          }}
          placeholder="e.g., 20" 
          keyboardType="numeric" 
          style={[styles.input, errors.cookTime && styles.inputError]} 
        />
        {errors.cookTime && <Text style={styles.errorText}>{errors.cookTime}</Text>}
        
        <Text style={styles.label}>Meal Type:</Text>
        <View style={styles.pickerContainer}> 
          <Picker
            selectedValue={mealType}
            onValueChange={(itemValue) => setMealType(itemValue)}
          >
            <Picker.Item label="Choose a meal type" value={null} />
            {MEAL_TYPE_CHOICES.map((item) => (
              <Picker.Item 
                key={item.value} 
                label={item.label} 
                value={item.value} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Cuisine Type:</Text>
        <TextInput
          value={cuisineType}
          onChangeText={setCuisineType}
          placeholder="e.g., Italian, Mexican, Asian"
          style={styles.input}
        />

        <Text style={styles.label}>Difficulty:</Text>
        <View style={styles.pickerContainer}>
          <Picker
              selectedValue={difficulty}
              onValueChange={(itemValue) => setDifficulty(itemValue)}
          >
              <Picker.Item label="Choose difficulty" value={null} />
              {DIFFICULTY_CHOICES.map((item) => (
                  <Picker.Item
                      key={item.value}
                      label={item.label}
                      value={item.value}
                  />
              ))}
          </Picker>
        </View>

        <Text style={styles.label}>Source Name:</Text>
        <TextInput
          value={sourceName}
          onChangeText={setSourceName}
          placeholder="e.g., Grandma's Cookbook"
          style={styles.input}
        />

        <Text style={styles.label}>Source URL:</Text>
        <TextInput
          value={sourceUrl}
          onChangeText={(text) => {
            setSourceUrl(text);
            if (errors.sourceUrl) setErrors({ ...errors, sourceUrl: null });
          }}
          placeholder="https://..."
          keyboardType="url"
          style={[styles.input, errors.sourceUrl && styles.inputError]}
        />
        {errors.sourceUrl && <Text style={styles.errorText}>{errors.sourceUrl}</Text>}

        <Text style={styles.label}>Rating (0-5):</Text>
        <TextInput
          value={rating}
          onChangeText={(text) => {
            setRating(text.replace(/[^0-9.]/g, ''));
            if (errors.rating) setErrors({ ...errors, rating: null });
          }}
          placeholder="e.g., 4.5"
          keyboardType="decimal-pad"
          style={[styles.input, errors.rating && styles.inputError]}
        />
        {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}

        <Text style={styles.label}>Person (Family Member):</Text>
        <View style={styles.pickerContainer}>
          <Picker
              selectedValue={selectedPerson}
              onValueChange={(itemValue) => setSelectedPerson(itemValue)}
          >
              <Picker.Item label="No person selected" value={null} />
              {people.map((person) => (
                  <Picker.Item
                      key={person.id}
                      label={`${person.first_name} ${person.last_name || ''}`.trim()}
                      value={person.id}
                  />
              ))}
          </Picker>
        </View>
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.push('/add_person')}
        >
          <Text style={styles.linkButtonText}>+ Add New Person</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Country:</Text>
        <View style={styles.pickerContainer}>
          <Picker
              selectedValue={selectedCountry}
              onValueChange={(itemValue) => setSelectedCountry(itemValue)}
          >
              <Picker.Item label="No country selected" value={null} />
              {countries.map((country) => (
                  <Picker.Item
                      key={country.id}
                      label={country.name}
                      value={country.id}
                  />
              ))}
          </Picker>
        </View>
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.push('/add_country')}
        >
          <Text style={styles.linkButtonText}>+ Add New Country</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Ingredients:</Text>
        <RecipeIngredients recipeId={id} isEditable={true} />

        <View style={styles.buttonContainer}>
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            disabled={!title.trim()} 
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
    marginBottom: 15,
  },
  linkButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  notFound: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  }
});