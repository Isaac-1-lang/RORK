import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useLeaveRequestStore } from '@/hooks/useLeaveRequestStore';
import { useWorkerStore } from '@/hooks/useWorkerStore';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { UserPlus, FileText, Calendar, Bell, Users, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function HRDashboardScreen() {
  const { user } = useAuthStore();
  const { leaveRequests } = useLeaveRequestStore();
  const { getWorkersByHR } = useWorkerStore();
  
  // Count pending leave requests
  const pendingLeaveRequests = leaveRequests.filter(
    request => request.status === 'pending'
  ).length;

  // Get workers managed by this HR
  const myWorkers = user ? getWorkersByHR(user.id) : [];
  const totalWorkers = myWorkers.length;

  if (user?.role !== 'hr') {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedText}>
          You don't have permission to access the HR dashboard.
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>HR Manager • {user.department}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <View style={styles.statIcon}>
            <Users size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>{totalWorkers}</Text>
          <Text style={styles.statLabel}>My Workers</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={styles.statIcon}>
            <Calendar size={24} color={Colors.warning} />
          </View>
          <Text style={styles.statValue}>{pendingLeaveRequests}</Text>
          <Text style={styles.statLabel}>Pending Requests</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={styles.statIcon}>
            <Clock size={24} color={Colors.error} />
          </View>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Late Today</Text>
        </Card>
      </View>
      
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <Button
            title="Register Worker"
            onPress={() => router.push('/hr/register-worker')}
            style={[styles.actionButton, styles.primaryAction]}
            icon={<UserPlus size={20} color="white" />}
          />
          
          <Button
            title="Leave Requests"
            onPress={() => router.push('/hr/leave-requests')}
            style={[styles.actionButton, styles.secondaryAction]}
            variant="outline"
            icon={<Calendar size={20} color={Colors.primary} />}
          />
        </View>
        
        <View style={styles.actionsGrid}>
          <Button
            title="Attendance Reports"
            onPress={() => router.push('/hr/reports')}
            style={[styles.actionButton, styles.secondaryAction]}
            variant="outline"
            icon={<FileText size={20} color={Colors.primary} />}
          />
          
          <Button
            title="Send Notifications"
            onPress={() => {
              // TODO: Implement notification sending
              alert('Notification feature coming soon!');
            }}
            style={[styles.actionButton, styles.secondaryAction]}
            variant="outline"
            icon={<Bell size={20} color={Colors.primary} />}
          />
        </View>
      </View>

      {totalWorkers > 0 && (
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <Text style={styles.activityText}>
              You have {totalWorkers} registered workers in your department
            </Text>
            <Text style={styles.activityTime}>Updated just now</Text>
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
  },
  secondaryAction: {
    borderColor: Colors.primary,
  },
  recentActivity: {
    marginBottom: 20,
  },
  activityCard: {
    padding: 16,
  },
  activityText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  unauthorizedText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  backButton: {
    width: 200,
  },
});