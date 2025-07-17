import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { getCompanyLocation, setCompanyLocation } from '@/utils/api';
import * as Location from 'expo-location';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function CompanyLocationScreen() {
  const { token } = useAuthStore();
  const safeToken = token ?? '';
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required.');
          setLoading(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLatitude(location.coords.latitude.toString());
        setLongitude(location.coords.longitude.toString());
      } else {
        Alert.alert('Not supported', 'Geolocation is not supported on web. Please enter manually.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location.');
    }
    setLoading(false);
  };

  const handleSaveLocation = async () => {
    if (!latitude || !longitude) {
      Alert.alert('Error', 'Please provide both latitude and longitude.');
      return;
    }
    setLoading(true);
    try {
      await setCompanyLocation(parseFloat(latitude), parseFloat(longitude), safeToken);
      Alert.alert('Success', 'Company location updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save company location.');
    }
    setLoading(false);
  };

  const handleFetchLocation = async () => {
    setLoading(true);
    try {
      const loc = await getCompanyLocation(safeToken);
      setLatitude(loc.latitude.toString());
      setLongitude(loc.longitude.toString());
    } catch (error) {
      Alert.alert('Info', 'No company location set yet.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Set Company Location</Text>
        <Button title="Use Current Location" onPress={handleUseCurrentLocation} isLoading={loading} style={styles.button} />
        <Text style={styles.label}>Latitude</Text>
        <TextInput
          style={styles.input}
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
          placeholder="Enter latitude"
        />
        <Text style={styles.label}>Longitude</Text>
        <TextInput
          style={styles.input}
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
          placeholder="Enter longitude"
        />
        <Button title="Save Location" onPress={handleSaveLocation} isLoading={loading} style={styles.button} />
        <Button title="Fetch Current Location" onPress={handleFetchLocation} isLoading={loading} variant="outline" style={styles.button} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  button: {
    marginTop: 16,
  },
}); 