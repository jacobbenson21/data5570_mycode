// --- File: app/index.jsx ---
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useSelector } from 'react-redux';
import RecipeList from '../components/RecipeList'; // Import the Child Component

// PARENT Component
export default function Index() {
  const recipes = useSelector((state) => state.recipes);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Family Recipes
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item, index) => (item?.id?.toString() || index.toString())}
        // 🚀 Using the reusable Child Component
        renderItem={({ item }) => {
            if (!item || !item.id) {
                return null;
            }
            return <RecipeList recipe={item} />;
        }}
        ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No recipes added yet.</Text>
        )}
      />

      <Link href="/add_recipe" asChild>
        <Text style={styles.linkText}>+ Add New Recipe</Text>
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
    emptyText: {
        color: '#888',
        marginTop: 10,
        textAlign: 'center'
    },
    linkText: { 
        color: 'blue', 
        marginTop: 20, 
        textAlign: 'center' 
    }
});