// --- File: app/people/edit/[id].jsx ---
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updatePerson } from '../../store';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateInput from '../../../components/DateInput';

export default function EditPerson() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const people = useSelector((state) => state.people?.items || []);
  const person = people.find(p => String(p.id) === String(id));

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (person) {
      setFirstName(person.first_name || '');
      setLastName(person.last_name || '');
      setBirthDate(person.birth_date || '');
      setDeathDate(person.death_date || '');
      setNotes(person.notes || '');
    }
  }, [person]);

  if (!person) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Person not found for editing.</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!firstName.trim()) {
      return;
    }

    const updatedPerson = {
      first_name: firstName.trim(),
      last_name: lastName.trim() || null,
      birth_date: birthDate.trim() || null,
      death_date: deathDate.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      await dispatch(updatePerson({ id: person.id, data: updatedPerson })).unwrap();
      router.back();
    } catch (error) {
      console.error('Error updating person:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.padding}>
        <Text style={styles.header}>Edit Family Member</Text>

        <Text style={styles.label}>First Name: *</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          style={styles.input}
        />

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
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />

        <DateInput
          label="Death Date:"
          value={deathDate}
          onChangeText={setDeathDate}
          placeholder="YYYY-MM-DD"
          style={styles.input}
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
            title="Save Changes" 
            onPress={handleSave} 
            disabled={!firstName.trim()} 
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
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  notFound: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  }
});

