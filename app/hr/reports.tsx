import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAttendanceStore } from '@/hooks/useAttendanceStore';
import { mockUsers } from '@/mocks/users';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import { ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ReportsScreen() {
  const { attendanceRecords } = useAttendanceStore();
  const [selectedMonth, setSelectedMonth] = useState('April 2024');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  
  const months = [
    'April 2024',
    'March 2024',
    'February 2024',
    'January 2024',
  ];
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter records for the current day
  const todayRecords = attendanceRecords.filter(
    record => record.date === today
  );
  
  // Map user IDs to names
  const getUserName = (userId: string) => {
    const user = mockUsers.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };
  
  const getUserDepartment = (userId: string) => {
    const user = mockUsers.find(user => user.id === userId);
    return user ? user.position : '';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Reports</Text>
        
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.monthDropdown}
            onPress={() => setShowMonthDropdown(!showMonthDropdown)}
          >
            <Text style={styles.monthText}>{selectedMonth}</Text>
            <ChevronDown size={20} color={Colors.text} />
          </TouchableOpacity>
          
          {showMonthDropdown && (
            <View style={styles.dropdownMenu}>
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedMonth(month);
                    setShowMonthDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{month}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      
      <Button
        title="Download PDF"
        variant="outline"
        style={styles.downloadButton}
        textStyle={styles.downloadButtonText}
      />
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.employeeColumn]}>Employee</Text>
          <Text style={[styles.tableHeaderCell, styles.assignmentColumn]}>Assignment</Text>
          <Text style={[styles.tableHeaderCell, styles.statusColumn]}>Status</Text>
        </View>
        
        {todayRecords.map((record) => (
          <View key={record.id} style={styles.tableRow}>
            <View style={[styles.tableCell, styles.employeeColumn]}>
              <Text style={styles.employeeName}>{getUserName(record.userId)}</Text>
              <Text style={styles.employeePosition}>{getUserDepartment(record.userId)}</Text>
            </View>
            
            <View style={[styles.tableCell, styles.assignmentColumn]}>
              <Text style={styles.timeIn}>{record.clockInTime || '--:--'}</Text>
              <Text style={styles.timeOut}>{record.clockOutTime || '--:--'}</Text>
            </View>
            
            <View style={[styles.tableCell, styles.statusColumn]}>
              <StatusBadge status={record.status} size="small" />
            </View>
          </View>
        ))}
        
        {todayRecords.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No attendance records for today</Text>
          </View>
        )}
      </View>
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
  monthSelector: {
    position: 'relative',
  },
  monthDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  monthText: {
    fontSize: 14,
    color: Colors.text,
    marginRight: 8,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 150,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  downloadButton: {
    marginBottom: 16,
  },
  downloadButtonText: {
    color: Colors.primary,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  employeeColumn: {
    flex: 2,
  },
  assignmentColumn: {
    flex: 1,
  },
  statusColumn: {
    flex: 1,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableCell: {
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  employeePosition: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  timeIn: {
    fontSize: 14,
    color: Colors.text,
  },
  timeOut: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});