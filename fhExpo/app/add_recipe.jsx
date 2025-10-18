// --- File: app/add_recipe.jsx ---
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    StyleSheet, 
    ScrollView,
    KeyboardAvoidingView, 
    Platform
  } from 'react-native';
  import { Picker } from '@react-native-picker/picker'
  import { useState } from 'react';
  import { useDispatch } from 'react-redux';
  import { addRecipe } from './store';
  import { useRouter } from 'expo-router';
  import { MEAL_TYPE_CHOICES } from '../constants/data';
  
  export default function AddRecipe() {
    const dispatch = useDispatch();
    const router = useRouter();
  
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [servings, setServings] = useState('');
    const [prepTime, setPrepTime] = useState(''); 
    const [mealType, setMealType] = useState(null);
    const [cookTime, setCookTime] = useState('');
  
    const handleAddRecipe = () => {
      // Check if all required fields are filled
      if (!title || !description || !servings || !prepTime || !cookTime || !mealType) {
        return;
      }
  
      const newRecipe = {
        id: Date.now().toString(),
        title,
        description,
        servings: parseInt(servings),
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        mealType: mealType,
        personId: null,
      };
  
      dispatch(addRecipe(newRecipe));
      router.push('/');
    };
  
    return (
      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.padding}>
          <Text style={styles.header}>Add New Recipe</Text>
  
          <Text style={styles.label}>Title: *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter recipe title"
            style={styles.input}
          />
  
          <Text style={styles.label}>Description: *</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter recipe description"
            multiline
            style={[styles.input, styles.multilineInput]}
          />
          
          <Text style={styles.label}>Servings: *</Text>
          <TextInput
            value={servings}
            onChangeText={(text) => setServings(text.replace(/[^0-9]/g, ''))}
            placeholder="e.g., 4"
            keyboardType="numeric"
            style={styles.input}
          />
          
          <Text style={styles.label}>Prep Time (minutes): *</Text>
          <TextInput
            value={prepTime}
            onChangeText={(text) => setPrepTime(text.replace(/[^0-9]/g, ''))}
            placeholder="e.g., 15"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Cook Time (minutes): *</Text>
          <TextInput
            value={cookTime}
            onChangeText={(text) => setCookTime(text.replace(/[^0-9]/g, ''))}
            placeholder="e.g., 20"
            keyboardType="numeric"
            style={styles.input}
           /> 

          <Text style={styles.label}>Meal Type: *</Text>
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
          
          <View style={styles.buttonWrapper}>
            <Button 
              title="Add Recipe" 
              onPress={handleAddRecipe} 
              disabled={!title || !description || !servings || !prepTime || !cookTime || !mealType} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
      flex: {
        flex: 1,
      },
      padding: {
        flex: 1,
        padding: 20, 
      },
      pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
      },
      scrollContainer: {
          paddingBottom: 20,
      },
      header: { 
          fontSize: 24, 
          fontWeight: 'bold', 
          marginBottom: 20 
      },
      label: { 
        marginTop: 5 
      },
      input: {
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 15,
          borderRadius: 8,
      },
      multilineInput: {
          height: 100,
          textAlignVertical: 'top',
      },
      buttonWrapper: {
          marginTop: 10,
          marginBottom: 40,
      }
  });