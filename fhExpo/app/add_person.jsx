// --- File: app/add_person.jsx ---
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
import { createPerson } from './store';
import { useRouter } from 'expo-router';
import { validateRequired, validateDate } from '../utils/validation';
import DateInput from '../components/DateInput';

export default function AddPerson() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    const firstNameError = validateRequired(firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;
    
    if (birthDate) {
      const birthDateError = validateDate(birthDate);
      if (birthDateError) newErrors.birthDate = birthDateError;
    }
    
    if (deathDate) {
      const deathDateError = validateDate(deathDate);
      if (deathDateError) newErrors.deathDate = deathDateError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPerson = async () => {
    if (!validateForm()) {
      return;
    }

    const newPerson = {
      first_name: firstName,
      last_name: lastName || null,
      birth_date: birthDate || null,
      death_date: deathDate || null,
      notes: notes || null,
    };

    try {
      await dispatch(createPerson(newPerson)).unwrap();
      router.back(); // Go back to previous screen (recipe form if coming from there)
    } catch (error) {
      console.error('Error creating person:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.padding}>
        <Text style={styles.header}>Add Family Member</Text>

        <Text style={styles.label}>First Name: *</Text>
        <TextInput
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            if (errors.firstName) setErrors({ ...errors, firstName: null });
          }}
          placeholder="Enter first name"
          style={[styles.input, errors.firstName && styles.inputError]}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
          style={styles.input}
        />

        <DateInput
          label="Birth Date:"
          value={birthDate}
          onChangeText={(text) => {
            setBirthDate(text);
            if (errors.birthDate) setErrors({ ...errors, birthDate: null });
          }}
          placeholder="YYYY-MM-DD"
          style={styles.input}
          error={errors.birthDate}
        />

        <DateInput
          label="Death Date:"
          value={deathDate}
          onChangeText={(text) => {
            setDeathDate(text);
            if (errors.deathDate) setErrors({ ...errors, deathDate: null });
          }}
          placeholder="YYYY-MM-DD"
          style={styles.input}
          error={errors.deathDate}
        />

        <Text style={styles.label}>Notes:</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional notes about this person"
          multiline
          style={[styles.input, styles.multilineInput]}
        />
        
        <View style={styles.buttonWrapper}>
          <Button 
            title="Add Person" 
            onPress={handleAddPerson} 
            disabled={!firstName} 
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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 40,
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

