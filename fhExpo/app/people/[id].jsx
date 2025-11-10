// --- File: app/people/[id].jsx ---
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deletePerson } from '../store';

export default function PersonDetail() {
  const { id } = useLocalSearchParams(); 
  const dispatch = useDispatch();
  const router = useRouter();

  const people = useSelector((state) => state.people?.items || []);
  const recipes = useSelector((state) => state.recipes?.items || []);
  
  const person = useMemo(() => {
    return people.find(p => String(p.id) === String(id));
  }, [people, id]);

  const personRecipes = useMemo(() => {
    return recipes.filter(r => r.person === person?.id);
  }, [recipes, person]);

  if (!person) return <Text style={styles.notFound}>Person not found</Text>;

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${person.first_name} ${person.last_name || ''}"?`);
    
    if (confirmed) {
      try {
        await dispatch(deletePerson(person.id)).unwrap();
        router.replace('/people');
      } catch (error) {
        console.error('Error deleting person:', error);
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
              onPress={() => router.push(`/people/edit/${id}`)}
            >
              <Text style={styles.editButtonText}>Edit Person</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {person.first_name} {person.last_name || ''}
          </Text>

          {person.birth_date && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>📅 Birth Date:</Text>
              <Text style={styles.infoText}>{person.birth_date}</Text>
            </View>
          )}

          {person.death_date && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>💀 Death Date:</Text>
              <Text style={styles.infoText}>{person.death_date}</Text>
            </View>
          )}

          {person.notes && (
            <>
              <Text style={styles.sectionHeader}>Notes</Text>
              <Text style={styles.descriptionText}>{person.notes}</Text>
            </>
          )}

          {personRecipes.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Recipes ({personRecipes.length})</Text>
              {personRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recipes/${recipe.id}`)}
                >
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.deleteButtonWrapper}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Person</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
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
  name: {
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20
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
  recipeItem: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
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

