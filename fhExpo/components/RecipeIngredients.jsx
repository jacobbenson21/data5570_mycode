// --- File: components/RecipeIngredients.jsx ---
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { createRecipeIngredient, deleteRecipeIngredient, createIngredient } from '../app/store';

export default function RecipeIngredients({ recipeId, isEditable = false, onIngredientsChange }) {
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredients?.items || []);
  const recipeIngredients = useSelector((state) => state.recipeIngredients?.items || []);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientUnit, setNewIngredientUnit] = useState('');
  const [tempIngredients, setTempIngredients] = useState([]); // For new recipes

  // Get ingredients for this recipe (or temp ingredients if recipeId is null)
  const currentRecipeIngredients = recipeId 
    ? recipeIngredients.filter(ri => String(ri.recipe) === String(recipeId))
    : tempIngredients;

  const handleAddIngredient = async () => {
    if (!selectedIngredient && !newIngredientName.trim()) {
      return;
    }

    let ingredientId = selectedIngredient;

    // If creating new ingredient
    if (!selectedIngredient && newIngredientName.trim()) {
      try {
        const newIngredient = {
          name: newIngredientName.trim(),
          unit: newIngredientUnit || null,
          notes: null,
        };
        const created = await dispatch(createIngredient(newIngredient)).unwrap();
        ingredientId = created.id;
        setNewIngredientName('');
        setNewIngredientUnit('');
      } catch (error) {
        console.error('Error creating ingredient:', error);
        return;
      }
    }

    // Add recipe ingredient
    const newRecipeIngredient = {
      recipe: recipeId,
      ingredient: ingredientId,
      quantity: quantity ? parseFloat(quantity) : null,
    };

    if (recipeId) {
      // Recipe exists, add to store via API
      try {
        await dispatch(createRecipeIngredient(newRecipeIngredient)).unwrap();
      } catch (error) {
        console.error('Error adding recipe ingredient:', error);
        return;
      }
    } else {
      // Recipe doesn't exist yet, store temporarily
      const tempRI = {
        ...newRecipeIngredient,
        id: Date.now().toString() + '_' + Math.random(),
      };
      setTempIngredients([...tempIngredients, tempRI]);
      if (onIngredientsChange) {
        onIngredientsChange([...tempIngredients, tempRI]);
      }
    }

    setSelectedIngredient(null);
    setQuantity('');
    setModalVisible(false);
  };

  const handleDeleteIngredient = async (recipeIngredientId) => {
    if (recipeId) {
      try {
        await dispatch(deleteRecipeIngredient(recipeIngredientId)).unwrap();
      } catch (error) {
        console.error('Error deleting recipe ingredient:', error);
      }
    } else {
      const updated = tempIngredients.filter(ri => ri.id !== recipeIngredientId);
      setTempIngredients(updated);
      if (onIngredientsChange) {
        onIngredientsChange(updated);
      }
    }
  };

  const getIngredientName = (ingredientId) => {
    const ingredient = ingredients.find(i => String(i.id) === String(ingredientId));
    return ingredient ? ingredient.name : 'Unknown';
  };

  const getIngredientUnit = (ingredientId) => {
    const ingredient = ingredients.find(i => String(i.id) === String(ingredientId));
    return ingredient ? ingredient.unit : '';
  };

  if (!isEditable && currentRecipeIngredients.length === 0) {
    return (
      <Text style={styles.emptyText}>No ingredients added yet.</Text>
    );
  }

  return (
    <View style={styles.container}>
      {currentRecipeIngredients.map((ri) => {
        const ingredientName = getIngredientName(ri.ingredient);
        const unit = getIngredientUnit(ri.ingredient);
        return (
          <View key={ri.id} style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>
              {ri.quantity ? `${ri.quantity} ` : ''}
              {unit && ri.quantity ? `${unit} ` : ''}
              {ingredientName}
            </Text>
            {isEditable && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteIngredient(ri.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {isEditable && (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Ingredient</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Ingredient</Text>
                
                <ScrollView>
                  <Text style={styles.label}>Select Existing Ingredient:</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedIngredient}
                      onValueChange={(itemValue) => {
                        setSelectedIngredient(itemValue);
                        setNewIngredientName(''); // Clear new ingredient when selecting existing
                      }}
                    >
                      <Picker.Item label="Or create new below" value={null} />
                      {ingredients.map((ing) => (
                        <Picker.Item
                          key={ing.id}
                          label={ing.name}
                          value={ing.id}
                        />
                      ))}
                    </Picker>
                  </View>

                  <Text style={styles.label}>Or Create New Ingredient:</Text>
                  <TextInput
                    value={newIngredientName}
                    onChangeText={(text) => {
                      setNewIngredientName(text);
                      setSelectedIngredient(null); // Clear selection when typing
                    }}
                    placeholder="Ingredient name"
                    style={styles.input}
                  />
                  <TextInput
                    value={newIngredientUnit}
                    onChangeText={setNewIngredientUnit}
                    placeholder="Unit (e.g., cups, oz, g)"
                    style={styles.input}
                  />

                  <Text style={styles.label}>Quantity:</Text>
                  <TextInput
                    value={quantity}
                    onChangeText={(text) => setQuantity(text.replace(/[^0-9.]/g, ''))}
                    placeholder="e.g., 2, 1.5"
                    keyboardType="decimal-pad"
                    style={styles.input}
                  />
                </ScrollView>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedIngredient(null);
                      setQuantity('');
                      setNewIngredientName('');
                      setNewIngredientUnit('');
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.addModalButton]}
                    onPress={handleAddIngredient}
                  >
                    <Text style={styles.modalButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  addModalButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

