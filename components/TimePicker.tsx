import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="HH:MM"
        keyboardType="numeric"
        maxLength={5}
      />
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: '#fff',
  },
});
