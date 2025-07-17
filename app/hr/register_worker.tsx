import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useLocationStore } from '@/hooks/useLocationStore';
import { useWorkerStore } from '@/hooks/useWorkerStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import TimePicker from '@/components/TimePicker';
import FingerprintButton from '@/components/FingerprintButton';
import { mockDepartments } from '@/mocks/departments';
import { mockPositions } from '@/mocks/positions';
import { MapPin, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function RegisterWorkerScreen() {
  const { user } = useAuthStore();
  const { currentLocation, getCurrentLocation, isLoading: locationLoading } = useLocationStore();
  const { registerWorker, isLoading: registering } = useWorkerStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    department: '',
    position: '',
    shiftStartTime: '',
  });
  
  const [fingerprintCaptured, setFingerprintCaptured] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get current location when component mounts
    getCurrentLocation();
    
    // Check biometric availability
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    if (Platform.OS === 'web') return;
    
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Biometric Setup Required',
          'Please ensure biometric authentication is set up on this device to register workers.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Biometric check error:', error);
    }
  };

  const departmentOptions = mockDepartments.map(dept => ({
    label: dept.name,
    value: dept.name
  }));

  const positionOptions = formData.department 
    ? (mockPositions[formData.department] || []).map(pos => ({
        label: pos,
        value: pos
      }))
    : [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,13}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number (10-13 digits)';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.position) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.shiftStartTime) {
      newErrors.shiftStartTime = 'Shift start time is required';
    }
    
    if (!currentLocation) {
      newErrors.location = 'Location is required';
    }
    
    if (!fingerprintCaptured) {
      newErrors.fingerprint = 'Fingerprint capture is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDepartmentChange = (department: string) => {
    setFormData(prev => ({ 
      ...prev, 
      department,
      position: '' // Reset position when department changes
    }));
    if (errors.department) {
      setErrors(prev => ({ ...prev, department: '' }));
    }
  };

  const handleCaptureFingerpint = async () => {
    if (Platform.OS === 'web') {
      // Simulate fingerprint capture on web
      setTimeout(() => {
        setFingerprintCaptured(true);
        if (errors.fingerprint) {
          setErrors(prev => ({ ...prev, fingerprint: '' }));
        }
      }, 1500);
      return;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert(
          'Biometric Hardware Not Available',
          'This device does not support biometric authentication.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Capture worker\'s fingerprint for registration',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setFingerprintCaptured(true);
        if (errors.fingerprint) {
          setErrors(prev => ({ ...prev, fingerprint: '' }));
        }
        Alert.alert(
          'Success',
          'Fingerprint captured successfully!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Fingerprint Capture Failed',
          'Please try again to capture the worker\'s fingerprint.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Fingerprint capture error:', error);
      Alert.alert(
        'Error',
        'Failed to capture fingerprint. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRegister = async () => {
    if (!validateForm() || !user || !currentLocation) return;
    
    const registrationData = {
      ...formData,
      geoLocation: currentLocation,
      fingerprintCaptured,
    };
    
    const success = await registerWorker(registrationData, user.id);
    
    if (success) {
      Alert.alert(
        'Success!',
        `Worker ${formData.name} has been successfully registered. Their fingerprint and location are now locked for attendance.`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      Alert.alert(
        'Error',
        'Failed to register worker. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (user?.role !== 'hr') {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedText}>
          You don't have permission to register workers.
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Register New Worker</Text>
          <Text style={styles.subtitle}>
            Fill in the details to register a new worker
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name *"
            placeholder="Enter worker's full name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            error={errors.name}
          />
          
          <Input
            label="Phone Number *"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
          />
          
          <Input
            label="Email (Optional)"
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          
          <Dropdown
            label="Department *"
            placeholder="Select department"
            options={departmentOptions}
            value={formData.department}
            onSelect={handleDepartmentChange}
            error={errors.department}
          />
          
          <Dropdown
            label="Job Position *"
            placeholder="Select position"
            options={positionOptions}
            value={formData.position}
            onSelect={(position) => handleInputChange('position', position)}
            error={errors.position}
            disabled={!formData.department}
          />
          
          <TimePicker
            label="Shift Start Time *"
            placeholder="Select start time"
            value={formData.shiftStartTime}
            onTimeSelect={(time) => handleInputChange('shiftStartTime', time)}
            error={errors.shiftStartTime}
          />
          
          <View style={styles.locationContainer}>
            <Text style={styles.label}>Work Location *</Text>
            {currentLocation ? (
              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <MapPin size={20} color={Colors.success} />
                  <Text style={styles.locationTitle}>Location Captured</Text>
                  <CheckCircle size={20} color={Colors.success} />
                </View>
                <Text style={styles.locationCoords}>
                  Lat: {currentLocation.latitude.toFixed(6)}, 
                  Lng: {currentLocation.longitude.toFixed(6)}
                </Text>
                <Image
                  source={{ 
                    uri: `https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80` 
                  }}
                  style={styles.mapPreview}
                />
              </View>
            ) : (
              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <MapPin size={20} color={Colors.textSecondary} />
                  <Text style={styles.locationTitle}>
                    {locationLoading ? 'Getting location...' : 'Location not available'}
                  </Text>
                </View>
                <Button
                  title="Get Current Location"
                  onPress={getCurrentLocation}
                  isLoading={locationLoading}
                  variant="outline"
                  size="small"
                  style={styles.locationButton}
                />
              </View>
            )}
            {errors.location && (
              <Text style={styles.errorText}>{errors.location}</Text>
            )}
          </View>
          
          <View style={styles.fingerprintSection}>
            <Text style={styles.label}>Fingerprint Authentication *</Text>
            <FingerprintButton
              label={fingerprintCaptured ? "Fingerprint Captured" : "Scan Fingerprint"}
              onPress={handleCaptureFingerpint}
            />
            {!fingerprintCaptured && (
              <Text style={styles.fingerprintHint}>
                Tap to capture worker's fingerprint for secure authentication
              </Text>
            )}
            {errors.fingerprint && (
              <Text style={styles.errorText}>{errors.fingerprint}</Text>
            )}
          </View>
          
          <Button
            title="Register Worker"
            onPress={handleRegister}
            isLoading={registering}
            style={styles.registerButton}
            disabled={!fingerprintCaptured || !currentLocation}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: Colors.text,
    fontWeight: '600',
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  locationCoords: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  mapPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  locationButton: {
    marginTop: 8,
  },
  fingerprintSection: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fingerprintHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  registerButton: {
    marginTop: 20,
    paddingVertical: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 8,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  unauthorizedText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  backButton: {
    width: 200,
  },
});