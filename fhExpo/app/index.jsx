// --- File: app/index.jsx ---
import { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import RecipeList from '../components/RecipeList';
import { MEAL_TYPE_CHOICES } from '../constants/data';

export default function Index() {
  const recipes = useSelector((state) => state.recipes?.items || []);
  const people = useSelector((state) => state.people?.items || []);
  const countries = useSelector((state) => state.countries?.items || []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMealType, setFilterMealType] = useState(null);
  const [filterPerson, setFilterPerson] = useState(null);
  const [filterCountry, setFilterCountry] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('title'); // 'title', 'rating', 'times_cooked', 'date'

  // Filter recipes based on search and filters
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = recipe.title?.toLowerCase().includes(query);
        const descriptionMatch = recipe.description?.toLowerCase().includes(query);
        const cuisineMatch = recipe.cuisine_type?.toLowerCase().includes(query);
        if (!titleMatch && !descriptionMatch && !cuisineMatch) {
          return false;
        }
      }

      // Meal type filter
      if (filterMealType && recipe.meal_type !== filterMealType) {
        return false;
      }

      // Person filter
      if (filterPerson && String(recipe.person) !== String(filterPerson)) {
        return false;
      }

      // Country filter
      if (filterCountry && String(recipe.country) !== String(filterCountry)) {
        return false;
      }

      return true;
    });
  }, [recipes, searchQuery, filterMealType, filterPerson, filterCountry]);

  // Sort filtered recipes
  const sortedRecipes = useMemo(() => {
    const sorted = [...filteredRecipes];
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'times_cooked':
        return sorted.sort((a, b) => (b.times_cooked || 0) - (a.times_cooked || 0));
      default:
        return sorted;
    }
  }, [filteredRecipes, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterMealType(null);
    setFilterPerson(null);
    setFilterCountry(null);
  };

  const hasActiveFilters = searchQuery || filterMealType || filterPerson || filterCountry;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Family Recipes</Text>

      <View style={styles.navButtons}>
        <Link href="/people" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>👥 People</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filter Toggle */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterToggleText}>
          {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
        </Text>
      </TouchableOpacity>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Meal Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterMealType}
              onValueChange={(itemValue) => setFilterMealType(itemValue)}
            >
              <Picker.Item label="All meal types" value={null} />
              {MEAL_TYPE_CHOICES.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Person:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterPerson}
              onValueChange={(itemValue) => setFilterPerson(itemValue)}
            >
              <Picker.Item label="All people" value={null} />
              {people.map((person) => (
                <Picker.Item
                  key={person.id}
                  label={`${person.first_name} ${person.last_name || ''}`.trim()}
                  value={person.id}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.filterLabel}>Country:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterCountry}
              onValueChange={(itemValue) => setFilterCountry(itemValue)}
            >
              <Picker.Item label="All countries" value={null} />
              {countries.map((country) => (
                <Picker.Item
                  key={country.id}
                  label={country.name}
                  value={country.id}
                />
              ))}
            </Picker>
          </View>

          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {hasActiveFilters && (
        <Text style={styles.resultCount}>
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </Text>
      )}

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
            onPress={() => setSortBy('title')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}>Title</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
            onPress={() => setSortBy('rating')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}>Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'times_cooked' && styles.sortButtonActive]}
            onPress={() => setSortBy('times_cooked')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'times_cooked' && styles.sortButtonTextActive]}>Times Cooked</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedRecipes}
        keyExtractor={(item, index) => (item?.id?.toString() || index.toString())}
        renderItem={({ item }) => {
          if (!item || !item.id) {
            return null;
          }
          return <RecipeList recipe={item} />;
        }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {hasActiveFilters ? 'No recipes match your filters.' : 'No recipes added yet.'}
          </Text>
        )}
      />

      <Link href="/add_recipe" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Recipe</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  navButtons: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  navButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    marginTop: 10,
    textAlign: 'center'
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  filterToggle: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterToggleText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#ff9800',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultCount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  sortContainer: {
    marginBottom: 15,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sortButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: 'white',
  }
});