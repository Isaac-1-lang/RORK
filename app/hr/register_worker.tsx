import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInputProps,
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.113:5000';

type FormData = {
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  shiftStart: string;
  geoLocation: string;
};

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (val: string) => void;
} & TextInputProps;

const FormField: React.FC<FormFieldProps> = ({ label, value, onChangeText, ...props }) => (
  <TextInput
    style={styles.input}
    placeholder={label}
    value={value}
    onChangeText={onChangeText}
    {...props}
  />
);

export default function RegisterWorker() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    position: '',
    shiftStart: '',
    geoLocation: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { name, email } = form;

    if (!name || !email) {
      Alert.alert('Error', 'Name and email are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/register-worker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Worker registered. OTP sent to email.');
        setForm({
          name: '',
          email: '',
          phoneNumber: '',
          department: '',
          position: '',
          shiftStart: '',
          geoLocation: '',
        });
      } else {
        const errorMessage = data?.error || (data?.message ? data.message : typeof data === 'string' ? data :
          'Registration failed.');
        Alert.alert('Error', errorMessage);
      }
    } catch (err) {
      Alert.alert('Error', 'Network error.');
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Worker</Text>

      <FormField label="Name" value={form.name} onChangeText={(val) => handleChange('name', val)} />
      <FormField
        label="Email"
        value={form.email}
        onChangeText={(val) => handleChange('email', val)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        label="Phone Number"
        value={form.phoneNumber}
        onChangeText={(val) => handleChange('phoneNumber', val)}
        keyboardType="phone-pad"
      />
      <FormField
        label="Department"
        value={form.department}
        onChangeText={(val) => handleChange('department', val)}
      />
      <FormField
        label="Position"
        value={form.position}
        onChangeText={(val) => handleChange('position', val)}
      />
      <FormField
        label="Shift Start Time"
        value={form.shiftStart}
        onChangeText={(val) => handleChange('shiftStart', val)}
      />
      <FormField
        label="GeoLocation"
        value={form.geoLocation}
        onChangeText={(val) => handleChange('geoLocation', val)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <Button
          title="Register"
          onPress={handleRegister}
          disabled={!form.name || !form.email}
          color="#0066cc"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
