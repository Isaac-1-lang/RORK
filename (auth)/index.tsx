import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import { demoCredentials } from '@/mocks/users';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading } = useAuthStore();

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
      // Navigation will be handled by the root layout
      router.replace('/(tabs)');
    } else {
      setErrors({
        password: 'Invalid email or password. Try: demo',
      });
      
      Alert.alert(
        "Login Failed",
        "Invalid credentials. Use 'demo' as password for any user.",
        [{ text: "OK" }]
      );
    }
  };

  const handleQuickLogin = async (userType: 'worker' | 'hr' | 'admin') => {
    let loginEmail = '';
    let loginPassword = 'demo';
    
    if (userType === 'worker') {
      loginEmail = demoCredentials.worker.email;
    } else if (userType === 'hr') {
      loginEmail = demoCredentials.hr.email;
    } else if (userType === 'admin') {
      loginEmail = demoCredentials.admin.email;
    }
    
    setEmail(loginEmail);
    setPassword(loginPassword);
    
    const success = await login(loginEmail, loginPassword);
    
    if (success) {
      router.replace('/(tabs)');
    } else {
      setErrors({
        password: 'Quick login failed. Please try manual login.',
      });
      
      Alert.alert(
        "Quick Login Failed",
        `Quick login attempt failed for ${userType} (${loginEmail}). Please try manual login.`,
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>RORK</Text>
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
              placeholder="Enter your password (use: demo)"
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
          </View>
        </Card>
        
        <View style={styles.quickLoginContainer}>
          <Text style={styles.quickLoginTitle}>Quick Login Options</Text>
          
          <View style={styles.quickLoginButtons}>
            <Button
              title="Login as Worker"
              variant="outline"
              size="small"
              onPress={() => handleQuickLogin('worker')}
              style={styles.quickLoginButton}
              disabled={isLoading}
            />
            
            <Button
              title="Login as HR"
              variant="outline"
              size="small"
              onPress={() => handleQuickLogin('hr')}
              style={styles.quickLoginButton}
              disabled={isLoading}
            />

            <Button
              title="Login as Admin"
              variant="outline"
              size="small"
              onPress={() => handleQuickLogin('admin')}
              style={styles.quickLoginButton}
              disabled={isLoading}
            />
          </View>
          
          <View style={styles.credentialsContainer}>
            <Text style={styles.credentialsTitle}>Demo Credentials:</Text>
            <Text style={styles.credentials}>Worker: {demoCredentials.worker.email} / demo</Text>
            <Text style={styles.credentials}>HR: {demoCredentials.hr.email} / demo</Text>
            <Text style={styles.credentials}>Admin: {demoCredentials.admin.email} / demo</Text>
            <Text style={styles.note}>Password for all users: demo</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loginCard: {
    marginBottom: 24,
    padding: 24,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: 16,
  },
  quickLoginContainer: {
    alignItems: 'center',
  },
  quickLoginTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 16,
  },
  quickLoginButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  quickLoginButton: {
    minWidth: 120,
  },
  credentialsContainer: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  credentialsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  credentials: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  note: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 8,
  },
});