import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLeaveRequestStore } from '@/hooks/useLeaveRequestStore';
import { LeaveRequest } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function LeaveRequestsScreen() {
  const { leaveRequests, updateLeaveRequestStatus, isLoading } = useLeaveRequestStore();
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');
  
  const filteredRequests = leaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === 'pending';
  });
  
  const handleApprove = (requestId: string) => {
    if (Platform.OS === 'web') {
      updateLeaveRequestStatus(requestId, 'approved');
      return;
    }
    
    Alert.alert(
      'Approve Request',
      'Are you sure you want to approve this leave request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Approve',
          onPress: () => updateLeaveRequestStatus(requestId, 'approved'),
        },
      ]
    );
  };
  
  const handleReject = (requestId: string) => {
    if (Platform.OS === 'web') {
      updateLeaveRequestStatus(requestId, 'rejected');
      return;
    }
    
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this leave request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          onPress: () => updateLeaveRequestStatus(requestId, 'rejected'),
          style: 'destructive',
        },
      ]
    );
  };
  
  const renderLeaveRequest = ({ item }: { item: LeaveRequest }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
    
    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <Text style={styles.employeeName}>{item.userName}</Text>
          <StatusBadge status={item.status} size="small" />
        </View>
        
        <View style={styles.requestDetails}>
          <Text style={styles.leaveType}>{item.leaveType}</Text>
          <Text style={styles.dates}>
            {item.startDate === item.endDate
              ? formatDate(item.startDate)
              : `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`
            }
          </Text>
          {item.reason && (
            <Text style={styles.reason} numberOfLines={2}>
              Reason: {item.reason}
            </Text>
          )}
        </View>
        
        {item.status === 'pending' && (
          <View style={styles.actions}>
            <Button
              title="Approve"
              variant="outline"
              size="small"
              onPress={() => handleApprove(item.id)}
              style={styles.approveButton}
              textStyle={styles.approveButtonText}
              disabled={isLoading}
            />
            <Button
              title="Reject"
              variant="outline"
              size="small"
              onPress={() => handleReject(item.id)}
              style={styles.rejectButton}
              textStyle={styles.rejectButtonText}
              disabled={isLoading}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'pending' && styles.activeFilter,
          ]}
          onPress={() => setFilter('pending')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'pending' && styles.activeFilterText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilter,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}
          >
            All Requests
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      ) : filteredRequests.length > 0 ? (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderLeaveRequest}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No {filter === 'pending' ? 'pending ' : ''}leave requests found
          </Text>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  requestDetails: {
    marginBottom: 16,
  },
  leaveType: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  dates: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  reason: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  approveButton: {
    borderColor: Colors.success,
  },
  approveButtonText: {
    color: Colors.success,
  },
  rejectButton: {
    borderColor: Colors.error,
  },
  rejectButtonText: {
    color: Colors.error,
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