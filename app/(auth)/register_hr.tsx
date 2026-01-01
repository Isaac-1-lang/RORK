import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import { registerHR } from '@/utils/api';
import { useAuthStore } from '@/hooks/useAuthStore';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define types for form and errors
interface RegisterHRForm {
  name: string;
  email: string;
  password: string;
  mockPayment: boolean;
  latitude: number | null;
  longitude: number | null;
}
interface RegisterHRErrors {
  name?: string;
  email?: string;
  password?: string;
  mockPayment?: string;
  latitude?: string;
  longitude?: string;
}

export default function RegisterHRScreen() {
  const [form, setForm] = useState<RegisterHRForm>({
    name: '',
    email: '',
    password: '',
    mockPayment: false,
    latitude: null,
    longitude: null,
  });
  const [errors, setErrors] = useState<RegisterHRErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState(false);

  const handleChange = (field: keyof RegisterHRForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setForm(prev => ({ ...prev, latitude, longitude }));
    setLocationSuccess(false);
    if (errors.latitude || errors.longitude) setErrors(prev => ({ ...prev, latitude: '', longitude: '' }));
  };

  const handleUseCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    setLocationSuccess(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied.');
        setLocationLoading(false);
        return;
      }
      // Note: expo-location does not support a 'timeout' option for getCurrentPositionAsync.
      // Location fetches may take several seconds depending on device and environment.
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setForm(prev => ({ ...prev, latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
      setLocationSuccess(true);
    } catch (err: any) {
      setLocationError('Failed to get current location.');
      setLocationSuccess(false);
    }
    setLocationLoading(false);
  };

  const validate = () => {
    const newErrors: RegisterHRErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.mockPayment) newErrors.mockPayment = 'Payment is required';
    if (form.latitude == null || form.longitude == null) {
      newErrors.latitude = 'Company location is required';
      newErrors.longitude = 'Company location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await registerHR(form); // Register the user
      // Immediately log in the user using the same credentials
      await login(form.email, form.password);
      router.replace('/hr');
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.message || 'An error occurred.');
    }
    setIsLoading(false);
  };

  const SCREEN_WIDTH = Dimensions.get('window').width;

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
            style={[styles.paymentRow]}
            onPress={() => handleChange('mockPayment', !form.mockPayment)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, form.mockPayment && styles.checkboxChecked]} />
            <Text style={styles.paymentLabel}>I have completed payment</Text>
          </TouchableOpacity>
          {errors.mockPayment && <Text style={styles.error}>{errors.mockPayment}</Text>}

          {/* Map Picker for Company Location */}
          <Text style={styles.label}>Select Company Location</Text>
          <Button
            title={locationLoading ? 'Getting Location...' : 'Use Current Location'}
            onPress={handleUseCurrentLocation}
            isLoading={locationLoading}
            style={{ marginBottom: 12 }}
          />
          {locationSuccess && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="check-circle" size={20} color="green" style={{ marginRight: 6 }} />
              <Text style={{ color: 'green', fontWeight: '500' }}>Location set successfully!</Text>
            </View>
          )}
          {locationError && <Text style={styles.error}>{locationError}</Text>}
          <MapView
            style={{ width: '100%', height: SCREEN_WIDTH * 0.6, borderRadius: 12, marginVertical: 12 }}
            initialRegion={{
              latitude: form.latitude || 0.3476,
              longitude: form.longitude || 32.5825,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress}
          >
            {form.latitude && form.longitude && (
              <Marker coordinate={{ latitude: form.latitude, longitude: form.longitude }} />
            )}
          </MapView>
          {(errors.latitude || errors.longitude) && <Text style={styles.error}>{errors.latitude || errors.longitude}</Text>}

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
  label: { fontSize: 16, color: Colors.text, marginBottom: 8, fontWeight: '500' },
}); 