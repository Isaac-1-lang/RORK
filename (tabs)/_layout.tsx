import React from 'react';
import { Tabs } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Home, Calendar, Bell, User, Users } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TabLayout() {
  const { user } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Dashboard',
        }}
      />
      
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      
      {user?.role === 'hr' && (
        <Tabs.Screen
          name="hr"
          options={{
            title: 'HR',
            tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
            href: '/hr',
          }}
        />
      )}
    </Tabs>
  );
}