import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Attendance } from '@/types';
import Button from './Button';
import StatusBadge from './StatusBadge';
import Colors from '@/constants/colors';
import { Clock } from 'lucide-react-native';

interface AttendanceCardProps {
  todayRecord: Attendance | null;
  onClockIn: () => void;
  onClockOut: () => void;
  isLoading: boolean;
  canClockIn: boolean;
}

export default function AttendanceCard({ 
  todayRecord, 
  onClockIn, 
  onClockOut, 
  isLoading, 
  canClockIn 
}: AttendanceCardProps) {
  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const canClockOut = todayRecord && todayRecord.clockInTime && !todayRecord.clockOutTime;
  const hasClocked = todayRecord && todayRecord.clockInTime;

  return (
    <View style={styles.container} accessible={true} accessibilityLabel="Attendance card">
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Clock size={20} color={Colors.primary} />
          <Text style={styles.title}>Today's Attendance</Text>
        </View>
        {todayRecord && (
          <StatusBadge status={todayRecord.status} accessibilityLabel={`Attendance status: ${todayRecord.status}`} />
        )}
      </View>
      
      {todayRecord ? (
        <View style={styles.timeContainer}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Clock In</Text>
            <Text style={styles.timeValue}>
              {todayRecord.clockInTime ? formatTime(todayRecord.clockInTime) : '-'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Clock Out</Text>
            <Text style={styles.timeValue}>
              {todayRecord.clockOutTime ? formatTime(todayRecord.clockOutTime) : '-'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Total Hours</Text>
            <Text style={styles.timeValue}>
              {todayRecord.totalHours ? `${todayRecord.totalHours}h` : '-'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.noRecordContainer}>
          <Text style={styles.noRecordText}>No attendance record for today</Text>
        </View>
      )}

      <View style={styles.actionContainer}>
        {!hasClocked ? (
          <Button
            title="Clock In"
            onPress={onClockIn}
            disabled={!canClockIn || isLoading}
            style={[
              styles.actionButton,
              (!canClockIn || isLoading) && styles.disabledButton
            ]}
          />
        ) : canClockOut ? (
          <Button
            title="Clock Out"
            onPress={onClockOut}
            disabled={isLoading}
            variant="outline"
            style={styles.actionButton}
          />
        ) : (
          <View style={styles.completedContainer} accessibilityRole="status" accessibilityLabel="Attendance completed for today">
            <Text style={styles.completedText}>✓ Attendance completed for today</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  noRecordContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noRecordText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  actionContainer: {
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  completedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
});