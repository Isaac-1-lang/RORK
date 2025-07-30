import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, Platform } from 'react-native';
import { useSession } from '@/hooks/useSession';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { LogOut, User, Calendar, Bell, Settings, Clock, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { 
    user, 
    logout, 
    getSessionInfo
  } = useSession();

  const sessionInfo = getSessionInfo();

  const handleLogout = () => {
    logout(); // This now includes confirmation dialog
  };

  const menuItems = [
    {
      icon: <User size={20} color={Colors.text} />,
      title: 'Personal Information',
      onPress: () => {},
    },
    {
      icon: <Calendar size={20} color={Colors.text} />,
      title: 'Attendance History',
      onPress: () => router.push('/attendance-history'),
    },
    {
      icon: <Bell size={20} color={Colors.text} />,
      title: 'Notification Settings',
      onPress: () => {},
    },
    {
      icon: <Settings size={20} color={Colors.text} />,
      title: 'App Settings',
      onPress: () => {},
    },
  ];

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <Image
          source={{ 
            uri: user.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.position}>{user.position}</Text>
        <Text style={styles.department}>{user.department}</Text>
      </View>
      
      <Card style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <View key={index}>
            <View style={styles.menuItem}>
              <View style={styles.menuIcon}>{item.icon}</View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            {index < menuItems.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Card>

      {sessionInfo && (
        <Card style={styles.sessionCard}>
          <Text style={styles.sessionTitle}>Session Information</Text>
          <View style={styles.sessionItem}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.sessionText}>
              Last login: {sessionInfo.lastLogin}
            </Text>
          </View>
          <View style={styles.sessionItem}>
            <RefreshCw size={16} color={Colors.textSecondary} />
            <Text style={styles.sessionText}>Status: Active</Text>
          </View>
        </Card>
      )}
      
      {user.role === 'hr' && (
        <Button
          title="HR Dashboard"
          onPress={() => router.push('/hr')}
          style={styles.hrButton}
        />
      )}
      
      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  department: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  menuCard: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  hrButton: {
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
  logoutButtonText: {
    color: Colors.error,
  },
  sessionCard: {
    marginBottom: 24,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  warningItem: {
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  refreshButton: {
    marginTop: 8,
  },
});