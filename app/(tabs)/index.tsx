import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useAttendanceStore } from '@/hooks/useAttendanceStore';
import { useLocationStore } from '@/hooks/useLocationStore';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LocationIndicator from '@/components/LocationIndicator';
import AttendanceCard from '@/components/AttendanceCard';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { 
    todayRecord, 
    isLoading: attendanceLoading, 
    clockIn, 
    clockOut, 
    fetchTodayAttendance 
  } = useAttendanceStore();
  const { 
    isAtWorkLocation, 
    checkIfAtWorkLocation, 
    isLoading: locationLoading 
  } = useLocationStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (user) {
      fetchTodayAttendance(user.id);
      checkIfAtWorkLocation();
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [user]);

  const handleClockIn = async () => {
    if (!user) return;
    router.push('/attendance-verification?action=clock-in');
  };

  const handleClockOut = async () => {
    if (!user) return;
    router.push('/attendance-verification?action=clock-out');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, {user.name}</Text>
        <Text style={styles.date}>{formatDate(currentTime)}</Text>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
      </View>

      <LocationIndicator isAtWorkLocation={isAtWorkLocation} />

      <AttendanceCard 
        todayRecord={todayRecord}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
        isLoading={attendanceLoading}
        canClockIn={isAtWorkLocation}
      />

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <Button
            title="Request Leave"
            variant="outline"
            onPress={() => router.push('/leave-request')}
            style={styles.actionButton}
          />
          
          <Button
            title="View History"
            variant="outline"
            onPress={() => router.push('/attendance-history')}
            style={styles.actionButton}
          />
        </View>
      </View>

      {user.role === 'hr' && (
        <Card style={styles.hrCard}>
          <Text style={styles.hrTitle}>HR Dashboard</Text>
          <Text style={styles.hrSubtitle}>Manage your team and view reports</Text>
          <Button
            title="Go to HR Dashboard"
            onPress={() => router.push('/hr')}
            style={styles.hrButton}
          />
        </Card>
      )}
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
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  time: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  quickActions: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
  },
  hrCard: {
    marginTop: 24,
    padding: 20,
    backgroundColor: Colors.primary,
  },
  hrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  hrSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  hrButton: {
    backgroundColor: 'white',
  },
});