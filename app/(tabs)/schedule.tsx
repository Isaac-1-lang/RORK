import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useAttendanceStore } from '@/hooks/useAttendanceStore';
import { Attendance } from '@/types';
import AttendanceCard from '@/components/AttendanceCard';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { router } from 'expo-router';

export default function ScheduleScreen() {
  const { user } = useAuthStore();
  const { fetchUserAttendance, isLoading } = useAttendanceStore();
  const [recentAttendance, setRecentAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (user) {
      loadAttendance();
    }
  }, [user]);

  const loadAttendance = async () => {
    if (!user) return;
    
    const records = await fetchUserAttendance(user.id);
    // Sort by date (most recent first) and take only the last 5
    const sorted = [...records].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5);
    
    setRecentAttendance(sorted);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>My Schedule</Text>
        <Button
          title="View All"
          variant="outline"
          size="small"
          onPress={() => router.push('/attendance-history')}
        />
      </View>
      
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : recentAttendance.length > 0 ? (
        <View style={styles.attendanceList}>
          {recentAttendance.map((record) => (
            <AttendanceCard key={record.id} attendance={record} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No attendance records found</Text>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  attendanceList: {
    marginTop: 8,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 24,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});