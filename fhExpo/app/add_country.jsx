// --- File: app/add_country.jsx ---
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
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCountry } from './store';
import { useRouter } from 'expo-router';

export default function AddCountry() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState('');
  const [region, setRegion] = useState('');

  const handleAddCountry = async () => {
    if (!name) {
      return;
    }

    const newCountry = {
      name: name,
      region: region || null,
    };

    try {
      await dispatch(createCountry(newCountry)).unwrap();
      router.back(); // Go back to previous screen (recipe form)
    } catch (error) {
      console.error('Error creating country:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.padding}>
        <Text style={styles.header}>Add Country</Text>

        <Text style={styles.label}>Country Name: *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g., Italy, Mexico, Japan"
          style={styles.input}
        />

        <Text style={styles.label}>Region:</Text>
        <TextInput
          value={region}
          onChangeText={setRegion}
          placeholder="e.g., Europe, North America, Asia"
          style={styles.input}
        />
        
        <View style={styles.buttonWrapper}>
          <Button 
            title="Add Country" 
            onPress={handleAddCountry} 
            disabled={!name} 
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
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 40,
  }
});

