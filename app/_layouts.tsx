import { Stack } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from '@/components/SessionProvider';

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="(auth)" />
          ) : (
            <Stack.Screen name="(tabs)" />
          )}
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="leave-request" options={{ headerShown: true, title: 'Request Leave' }} />
          <Stack.Screen name="attendance-history" options={{ headerShown: true, title: 'Attendance History' }} />
          <Stack.Screen name="hr" options={{ headerShown: true, title: 'HR Dashboard' }} />
        </Stack>
      </SessionProvider>
    </QueryClientProvider>
  );
}