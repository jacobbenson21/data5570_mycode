// Date input component with better date handling
import { Platform } from 'react-native';
import { TextInput, View, Text, StyleSheet } from 'react-native';

export default function DateInput({ value, onChangeText, placeholder, style, error, label }) {
  const handleDateChange = (text) => {
    // Auto-format as user types: YYYY-MM-DD
    let formatted = text.replace(/[^0-9]/g, '');
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
    }
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 7) + '-' + formatted.slice(7, 9);
    }
    onChangeText(formatted);
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px',
            borderWidth: 1,
            borderColor: error ? '#ff4444' : '#ccc',
            borderRadius: 8,
            fontSize: 16,
            marginBottom: error ? 5 : 15,
          }}
        />
      ) : (
        <TextInput
          value={value}
          onChangeText={handleDateChange}
          placeholder={placeholder || 'YYYY-MM-DD'}
          keyboardType="numeric"
          maxLength={10}
          style={[style, error && styles.inputError]}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
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
  },
});

