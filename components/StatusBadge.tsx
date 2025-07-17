import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface StatusBadgeProps {
  status: 'present' | 'absent' | 'late' | 'on_leave' | string;
  accessibilityLabel?: string;
}

const statusColors: Record<string, string> = {
  present: Colors.success,
  absent: Colors.error,
  late: Colors.warning,
  on_leave: '#3B82F6', // blue for on_leave
};

export default function StatusBadge({ status, accessibilityLabel }: StatusBadgeProps) {
  const color = statusColors[status] || Colors.textSecondary;
  return (
    <View
      style={[styles.badge, { backgroundColor: color }]}
      accessible={true}
      accessibilityLabel={accessibilityLabel || `Status: ${status}`}
    >
      <Text style={styles.text}>{status.replace('_', ' ').toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
});



