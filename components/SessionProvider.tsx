import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSessionManager } from '@/hooks/useSessionManager';

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { validateSession, logout, isAuthenticated } = useAuthStore();
  
  useSessionManager();

  useEffect(() => {
    const initializeSession = async () => {
      if (isAuthenticated) {
        const isValid = validateSession();
        if (!isValid) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [
              {
                text: 'OK',
                onPress: () => logout(),
              },
            ]
          );
        }
      }
    };

    initializeSession();
  }, [isAuthenticated]);

  return <>{children}</>;
}; 