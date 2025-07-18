import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import { registerHR } from '@/utils/api';

export default function RegisterHRScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mockPayment: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.mockPayment) newErrors.mockPayment = 'Payment is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await registerHR(form);
      Alert.alert('Success', 'HR registered successfully! You can now log in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)') }
      ]);
    } catch (err) {
      Alert.alert('Registration Failed', err?.message || 'An error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Register as HR</Text>
          <Text style={styles.subtitle}>Create your HR account to manage your team</Text>
        </View>
        <Card style={styles.card}>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
            error={errors.name}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Enter a password"
            value={form.password}
            onChangeText={v => handleChange('password', v)}
            secureTextEntry
            error={errors.password}
          />
          <TouchableOpacity
            style={styles.paymentRow}
            onPress={() => handleChange('mockPayment', !form.mockPayment)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, form.mockPayment && styles.checkboxChecked]} />
            <Text style={styles.paymentLabel}>I have completed payment (mock)</Text>
          </TouchableOpacity>
          {errors.mockPayment && <Text style={styles.error}>{errors.mockPayment}</Text>}
          <Button
            title="Register"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.registerButton}
          />
          <TouchableOpacity onPress={() => router.replace('/(auth)')} style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
  card: { padding: 24 },
  registerButton: { marginTop: 16 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: Colors.primary, borderRadius: 4, marginRight: 12 },
  checkboxChecked: { backgroundColor: Colors.primary },
  paymentLabel: { fontSize: 16, color: Colors.text },
  error: { color: Colors.error, fontSize: 14, marginTop: 4 },
  loginLink: { marginTop: 16, alignItems: 'center' },
  loginText: { color: Colors.primary, fontSize: 16, fontWeight: '500' },
}); 