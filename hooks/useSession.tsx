import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from './useAuthStore';
import { sessionUtils } from '@/utils/api';

export const useSession = () => {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    validateSession,
    clearSession,
    updateUser,
  } = useAuthStore();

  const loginWithSession = useCallback(async (email: string, password: string) => {
    try {
      const success = await login(email, password);
      if (success) {
        console.log('Login successful');
        return true;
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An error occurred during login. Please try again.');
      return false;
    }
  }, [login]);

  const logoutWithConfirmation = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            console.log('User logged out');
          },
        },
      ]
    );
  }, [logout]);

  const getSessionInfo = useCallback(() => {
    if (!isAuthenticated || !user) {
      return null;
    }

    return {
      user,
      isAuthenticated,
      lastLogin: new Date().toLocaleDateString(),
    };
  }, [isAuthenticated, user]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login: loginWithSession,
    logout: logoutWithConfirmation,
    validateSession,
    clearSession,
    updateUser,
    getSessionInfo,
    sessionUtils,
  };
}; 