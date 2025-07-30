import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from './useAuthStore';

export const useSessionManager = () => {
  const { validateSession, logout } = useAuthStore();
  const appState = useRef(AppState.currentState);
  const sessionCheckInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSessionMonitoring = () => {
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
    }

    sessionCheckInterval.current = setInterval(async () => {
      const isValid = validateSession();
      if (!isValid) {
        logout();
      }
    }, 5 * 60 * 1000);
  };

  const stopSessionMonitoring = () => {
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
      sessionCheckInterval.current = null;
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground');
      
      const isValid = validateSession();
      if (!isValid) {
        logout();
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    startSessionMonitoring();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      stopSessionMonitoring();
      subscription?.remove();
    };
  }, []);

  return {
    startSessionMonitoring,
    stopSessionMonitoring,
  };
}; 