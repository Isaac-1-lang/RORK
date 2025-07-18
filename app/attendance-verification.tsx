import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useAttendanceStore } from '@/hooks/useAttendanceStore';
import { useLocationStore } from '@/hooks/useLocationStore';
import Card from '@/components/Card';
import Button from '@/components/Button';
import FingerprintButton from '@/components/FingerPrint';
import { CheckCircle, MapPin, AlertTriangle, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getLocationStatus } from '@/utils/geofancing';
import { mockWorkLocations } from '@/mocks/locations';

type VerificationStep = 'fingerprint' | 'location' | 'processing' | 'success' | 'error';

export default function AttendanceVerificationScreen() {
  const { action } = useLocalSearchParams<{ action: 'clock-in' | 'clock-out' }>();
  const { user } = useAuthStore();
  const { clockIn, clockOut, isLoading } = useAttendanceStore();
  const { checkIfAtWorkLocation, isAtWorkLocation, currentLocation } = useLocationStore();
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>('fingerprint');
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationStatus, setLocationStatus] = useState<any>(null);

  useEffect(() => {
    // Check biometric availability
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    if (Platform.OS === 'web') {
      // Skip biometric check on web
      setFingerprintVerified(true);
      setCurrentStep('location');
      return;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware) {
        setErrorMessage('Biometric hardware not available');
        setCurrentStep('error');
        return;
      }
      
      if (!isEnrolled) {
        setErrorMessage('No biometric data enrolled. Please set up fingerprint/face ID in device settings.');
        setCurrentStep('error');
        return;
      }
    } catch (error) {
      console.error('Biometric check error:', error);
      setErrorMessage('Failed to check biometric availability');
      setCurrentStep('error');
    }
  };

  const handleFingerprintScan = async () => {
    if (Platform.OS === 'web') {
      // Simulate fingerprint success on web
      setTimeout(() => {
        setFingerprintVerified(true);
        setCurrentStep('location');
      }, 1500);
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Verify your identity to ${action === 'clock-in' ? 'clock in' : 'clock out'}`,
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setFingerprintVerified(true);
        setCurrentStep('location');
      } else {
        setErrorMessage('Fingerprint authentication failed. Please try again.');
        setCurrentStep('error');
      }
    } catch (error) {
      console.error('Fingerprint authentication error:', error);
      setErrorMessage('Authentication failed. Please try again.');
      setCurrentStep('error');
    }
  };

  const handleLocationVerification = async () => {
    setIsProcessing(true);
    
    try {
      if (Platform.OS !== 'web') {
        // Get current location on mobile
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMessage('Location permission denied. Please enable location access.');
          setCurrentStep('error');
          setIsProcessing(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        // Update location store
        useLocationStore.setState({
          currentLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
        });
      } else {
        // Use mock location for web
        useLocationStore.setState({
          currentLocation: {
            latitude: 37.7749,
            longitude: -122.4194,
          }
        });
      }

      // Check if at work location
      await checkIfAtWorkLocation();
      
      // Get detailed location status
      const workLocation = mockWorkLocations[0];
      const currentLoc = useLocationStore.getState().currentLocation;
      if (currentLoc) {
        const status = getLocationStatus(currentLoc, workLocation, 50);
        setLocationStatus(status);
        
        if (status.isWithinArea) {
          setLocationVerified(true);
          setCurrentStep('processing');
          await processAttendance();
        } else {
          setErrorMessage(`You are outside the work area. ${status.message}`);
          setCurrentStep('error');
        }
      } else {
        setErrorMessage('Unable to determine your location. Please try again.');
        setCurrentStep('error');
      }
    } catch (error) {
      console.error('Location verification error:', error);
      setErrorMessage('Failed to verify location. Please try again.');
      setCurrentStep('error');
    }
    
    setIsProcessing(false);
  };

  const processAttendance = async () => {
    if (!user) return;
    
    try {
      if (action === 'clock-in') {
        await clockIn();
      } else {
        await clockOut();
      }
      
      setCurrentStep('success');
      
      // Auto-redirect after success
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error('Attendance processing error:', error);
      setErrorMessage(`Failed to ${action === 'clock-in' ? 'clock in' : 'clock out'}. Please try again.`);
      setCurrentStep('error');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'fingerprint':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 1: Verify Identity</Text>
            <Text style={styles.stepDescription}>
              Please scan your fingerprint to verify your identity
            </Text>
            
            <FingerprintButton
              onPress={handleFingerprintScan}
              label={fingerprintVerified ? 'Fingerprint Captured' : 'Scan Fingerprint'}
              disabled={fingerprintVerified}
            />
            
            {fingerprintVerified && (
              <View style={styles.successMessage}>
                <CheckCircle size={20} color={Colors.success} />
                <Text style={styles.successText}>Identity verified successfully</Text>
              </View>
            )}
          </View>
        );

      case 'location':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 2: Verify Location</Text>
            <Text style={styles.stepDescription}>
              Checking if you're within the work area (50m radius)
            </Text>
            
            <View style={styles.locationContainer}>
              <MapPin size={48} color={Colors.primary} />
              <Text style={styles.locationText}>
                {locationStatus ? locationStatus.message : 'Verifying your location...'}
              </Text>
              {locationStatus && (
                <Text style={styles.distanceText}>
                  Distance: {locationStatus.formattedDistance}
                </Text>
              )}
            </View>
            
            <Button
              title="Verify Location"
              onPress={handleLocationVerification}
              disabled={isProcessing}
              style={styles.verifyButton}
            />
            
            {locationVerified && (
              <View style={styles.successMessage}>
                <CheckCircle size={20} color={Colors.success} />
                <Text style={styles.successText}>Location verified - You're at work!</Text>
              </View>
            )}
          </View>
        );

      case 'processing':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Processing...</Text>
            <Text style={styles.stepDescription}>
              {action === 'clock-in' ? 'Clocking you in' : 'Clocking you out'}...
            </Text>
            
            <View style={styles.processingContainer}>
              <Clock size={48} color={Colors.primary} />
              <Text style={styles.processingText}>Please wait...</Text>
            </View>
          </View>
        );

      case 'success':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Success!</Text>
            <Text style={styles.stepDescription}>
              You have successfully {action === 'clock-in' ? 'clocked in' : 'clocked out'}
            </Text>
            
            <View style={styles.successContainer}>
              <CheckCircle size={64} color={Colors.success} />
              <Text style={styles.successTitle}>
                {action === 'clock-in' ? 'Welcome to work!' : 'Have a great day!'}
              </Text>
              <Text style={styles.successTime}>
                Time: {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
          </View>
        );

      case 'error':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Verification Failed</Text>
            
            <View style={styles.errorContainer}>
              <AlertTriangle size={48} color={Colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Try Again"
                onPress={() => {
                  setCurrentStep('fingerprint');
                  setFingerprintVerified(false);
                  setLocationVerified(false);
                  setErrorMessage('');
                }}
                style={styles.retryButton}
              />
              
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => router.back()}
                style={styles.cancelButton}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: action === 'clock-in' ? 'Clock In Verification' : 'Clock Out Verification',
          headerBackTitle: 'Back',
        }} 
      />
      
      <Card style={styles.card}>
        {renderStepContent()}
      </Card>
      
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={[
          styles.progressStep,
          (currentStep === 'fingerprint' || fingerprintVerified) && styles.progressStepActive
        ]} />
        <View style={[
          styles.progressStep,
          (currentStep === 'location' || locationVerified) && styles.progressStepActive
        ]} />
        <View style={[
          styles.progressStep,
          (currentStep === 'processing' || currentStep === 'success') && styles.progressStepActive
        ]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  card: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  locationText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  processingContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  processingText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 16,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success,
    marginTop: 16,
    marginBottom: 8,
  },
  successTime: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  successText: {
    fontSize: 14,
    color: Colors.success,
    marginLeft: 8,
    fontWeight: '500',
  },
  verifyButton: {
    marginTop: 16,
    paddingVertical: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    paddingVertical: 16,
  },
  cancelButton: {
    paddingVertical: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  progressStep: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
  },
  progressStepActive: {
    backgroundColor: Colors.primary,
  },
});