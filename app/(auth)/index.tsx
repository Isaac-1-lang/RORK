import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading, user } = useAuthStore();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    const success = await login(email, password);
    
    if (success) {
      // Navigate to HR dashboard if user is HR
      if (user && user.role === 'hr') {
        router.replace('/hr');
      } else {
        router.replace('/');
      }
    } else {
      setErrors({
        password: 'Invalid email or password.',
      });
      
      Alert.alert(
        "Login Failed",
        "Invalid credentials.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-group" size={64} color={Colors.primary} style={styles.logoIcon} />
          <Text style={styles.title}>Welcome to RORK</Text>
          <Text style={styles.subtitle}>Worker Attendance & HR Management</Text>
        </View>
        <Card style={styles.loginCard}>
          <Text style={styles.loginTitle}>Sign In</Text>
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />
            <Button
              title="Log In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />
            <TouchableOpacity onPress={() => router.push('/(auth)/register_hr')} style={styles.registerLink}>
              <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerTextBold}>Register as HR</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(auth)/otp_login')} style={styles.registerLink}>
              <Text style={styles.registerText}>First time? <Text style={styles.registerTextBold}>Use OTP</Text></Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
    position: 'relative',
  },
  bgCircle1: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primary,
    opacity: 0.08,
    zIndex: 0,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -100,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.primary,
    opacity: 0.06,
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  loginCard: {
    marginBottom: 24,
    padding: 28,
    borderRadius: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    backgroundColor: '#fff',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  registerTextBold: {
    color: Colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});