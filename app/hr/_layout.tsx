import { Stack } from "expo-router";

export default function HRLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: '#1E293B',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'HR Dashboard',
        }}
      />
      <Stack.Screen
        name="reports"
        options={{
          title: 'Attendance Reports',
        }}
      />
      <Stack.Screen
        name="leave-requests"
        options={{
          title: 'Leave Requests',
        }}
      />
      <Stack.Screen
        name="register-worker"
        options={{
          title: 'Register Worker',
        }}
      />
    </Stack>
  );
}