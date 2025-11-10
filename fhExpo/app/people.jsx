// --- File: app/people.jsx ---
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useSelector } from 'react-redux';

export default function PeopleList() {
  const people = useSelector((state) => state.people?.items || []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Family Members</Text>

      <FlatList
        data={people}
        keyExtractor={(item, index) => (item?.id?.toString() || index.toString())}
        renderItem={({ item }) => {
          if (!item || !item.id) {
            return null;
          }
          return (
            <Link href={`/people/${item.id}`} asChild>
              <TouchableOpacity style={styles.personItem}>
                <Text style={styles.personName}>
                  {item.first_name} {item.last_name || ''}
                </Text>
                {item.birth_date && (
                  <Text style={styles.personDates}>
                    Born: {item.birth_date}
                  </Text>
                )}
              </TouchableOpacity>
            </Link>
          );
        }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No family members added yet.</Text>
        )}
      />

      <Link href="/add_person" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Person</Text>
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
  personItem: {
    backgroundColor: '#eee',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  personName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  personDates: {
    fontSize: 14,
    color: '#666',
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
  }
});

