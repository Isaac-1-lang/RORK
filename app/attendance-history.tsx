import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useAttendanceStore } from '@/hooks/useAttendanceStore';
import { Attendance } from '@/types';
import AttendanceCard from '@/components/attendanceCard';
import Colors from '@/constants/colors';

export default function AttendanceHistoryScreen() {
  const { user } = useAuthStore();
  const { fetchAttendanceHistory, attendanceRecords, isLoading } = useAttendanceStore();
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (user) {
      loadAttendance();
    }
  }, [user]);

  const loadAttendance = async () => {
    if (!user) return;
    await fetchAttendanceHistory();
    // Sort by date (most recent first)
    const sorted = [...attendanceRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setAttendance(sorted);
  };

  // Group attendance by month
  const groupedAttendance = attendance.reduce((groups: Record<string, Attendance[]>, record) => {
    const date = new Date(record.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    
    groups[monthYear].push(record);
    return groups;
  }, {});

  // Convert to array for FlatList
  const sections = Object.entries(groupedAttendance).map(([title, data]) => ({
    title,
    data,
  }));

  const renderSectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading attendance records...</Text>
        </View>
      ) : attendance.length > 0 ? (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.section}>
              {renderSectionHeader(item)}
              {item.data.map((record) => (
                <AttendanceCard
                  key={record.id}
                  todayRecord={record}
                  onClockIn={() => {}}
                  onClockOut={() => {}}
                  isLoading={false}
                  canClockIn={true}
                />
              ))}
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No attendance records found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});