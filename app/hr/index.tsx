import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated, Easing, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useLeaveRequestStore } from '@/hooks/useLeaveRequestStore';
import { useWorkerStore } from '@/hooks/useWorkerStore';
import { useNotificationStore } from '@/hooks/useNotificationStore';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Bell, UserCircle, UserPlus, FileText, Calendar, Users, Clock, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { User } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HRDashboardScreen() {
  const { user } = useAuthStore();
  const { leaveRequests } = useLeaveRequestStore();
  const { getWorkersByHR } = useWorkerStore();
  const { notifications, unreadCount } = useNotificationStore();
  const [myWorkers, setMyWorkers] = useState<User[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchWorkers = async () => {
      if (user) {
        const workers = await getWorkersByHR(user.id);
        setMyWorkers(workers);
      }
    };
    fetchWorkers();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [user, getWorkersByHR]);

  // Count pending leave requests
  const pendingLeaveRequests = leaveRequests.filter(
    request => request.status === 'pending'
  ).length;

  const totalWorkers = myWorkers.length;

  // Recent activity (mocked for now)
  const recentActivity = [
    ...myWorkers.slice(-2).map(worker => ({
      type: 'worker',
      name: worker.name,
      time: 'Just now',
      avatar: worker.profileImage || undefined,
    })),
    ...leaveRequests.slice(-2).map(req => ({
      type: 'leave',
      name: req.userName,
      time: 'Today',
      avatar: undefined,
    })),
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Notifications Banner */}
      {unreadCount > 0 && (
        <View style={styles.notificationBanner}>
          <Bell size={20 * (SCREEN_WIDTH / 375)} color={Colors.primary} />
          <Text style={styles.notificationText}>You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}!</Text>
        </View>
      )}

      {/* Welcome Section */}
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <Image
            source={{ uri: (user?.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'HR')) }}
            style={[styles.avatar, { width: SCREEN_WIDTH * 0.14, height: SCREEN_WIDTH * 0.14, borderRadius: SCREEN_WIDTH * 0.07 }]}
          />
          <View style={styles.headerText}>
            <Text style={[styles.greeting, { fontSize: SCREEN_WIDTH < 350 ? 13 : 16 }]}>Welcome back,</Text>
            <Text style={[styles.name, { fontSize: SCREEN_WIDTH < 350 ? 20 : 28 }]}>{user?.name || 'HR'}</Text>
            <Text style={[styles.role, { fontSize: SCREEN_WIDTH < 350 ? 12 : 14 }]}>HR Manager{user?.department ? ` • ${user.department}` : ''}</Text>
          </View>
        </View>
      </View>

      {/* Responsive Horizontal Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={styles.statsScrollContent}>
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}> 
          <Card style={[styles.statCard, { minWidth: SCREEN_WIDTH * 0.5, maxWidth: SCREEN_WIDTH * 0.7 }]}> 
            <View style={styles.statIcon}><Users size={24 * (SCREEN_WIDTH / 375)} color={Colors.primary} /></View>
            <Text style={[styles.statValue, { fontSize: SCREEN_WIDTH < 350 ? 18 : 24 }]}>{totalWorkers}</Text>
            <Text style={styles.statLabel}>My Workers</Text>
          </Card>
          <Card style={[styles.statCard, { minWidth: SCREEN_WIDTH * 0.5, maxWidth: SCREEN_WIDTH * 0.7 }]}> 
            <View style={styles.statIcon}><Calendar size={24 * (SCREEN_WIDTH / 375)} color={Colors.warning} /></View>
            <Text style={[styles.statValue, { fontSize: SCREEN_WIDTH < 350 ? 18 : 24 }]}>{pendingLeaveRequests}</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
          </Card>
          <Card style={[styles.statCard, { minWidth: SCREEN_WIDTH * 0.5, maxWidth: SCREEN_WIDTH * 0.7 }]}> 
            <View style={styles.statIcon}><Clock size={24 * (SCREEN_WIDTH / 375)} color={Colors.error} /></View>
            <Text style={[styles.statValue, { fontSize: SCREEN_WIDTH < 350 ? 18 : 24 }]}>3</Text>
            <Text style={styles.statLabel}>Late Today</Text>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Quick Actions - Responsive Grid */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={[styles.actionsGrid, { flexDirection: SCREEN_WIDTH < 400 ? 'column' : 'row', gap: SCREEN_WIDTH < 400 ? 12 : 16 }]}> 
          <TouchableOpacity style={[styles.actionButton, styles.primaryAction, { width: SCREEN_WIDTH < 400 ? '100%' : '48%' }]} onPress={() => router.push('/hr/register_worker')}>
            <UserPlus size={20 * (SCREEN_WIDTH / 375)} color="white" />
            <Text style={styles.actionButtonText}>Register Worker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryAction, { width: SCREEN_WIDTH < 400 ? '100%' : '48%' }]} onPress={() => router.push('/hr/leave-requests')}>
            <Calendar size={20 * (SCREEN_WIDTH / 375)} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Leave Requests</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.actionsGrid, { flexDirection: SCREEN_WIDTH < 400 ? 'column' : 'row', gap: SCREEN_WIDTH < 400 ? 12 : 16 }]}> 
          <TouchableOpacity style={[styles.actionButton, styles.secondaryAction, { width: SCREEN_WIDTH < 400 ? '100%' : '48%' }]} onPress={() => router.push('/hr/reports')}>
            <FileText size={20 * (SCREEN_WIDTH / 375)} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Attendance Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryAction, { width: SCREEN_WIDTH < 400 ? '100%' : '48%' }]} onPress={() => alert('Notification feature coming soon!')}>
            <Bell size={20 * (SCREEN_WIDTH / 375)} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Send Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity Feed - Responsive */}
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertCircle size={40 * (SCREEN_WIDTH / 375)} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No recent activity yet.</Text>
          </View>
        ) : (
          recentActivity.map((item, idx) => (
            <Card key={idx} style={[styles.activityCard, { flexDirection: SCREEN_WIDTH < 400 ? 'column' : 'row', alignItems: 'center' }]}> 
              <View style={styles.activityRow}>
                <Image
                  source={{ uri: item.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name) }}
                  style={[styles.activityAvatar, { width: SCREEN_WIDTH * 0.09, height: SCREEN_WIDTH * 0.09, borderRadius: SCREEN_WIDTH * 0.045 }]}
                />
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityName, { fontSize: SCREEN_WIDTH < 350 ? 12 : 14 }]}>{item.name}</Text>
                  <Text style={[styles.activityType, { fontSize: SCREEN_WIDTH < 350 ? 10 : 12 }]}>{item.type === 'worker' ? 'New Worker' : 'Leave Request'}</Text>
                </View>
                <Text style={[styles.activityTime, { fontSize: SCREEN_WIDTH < 350 ? 10 : 12 }]}>{item.time}</Text>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Empty State for Workers */}
      {totalWorkers === 0 && (
        <View style={styles.emptyState}>
          <UserCircle size={48 * (SCREEN_WIDTH / 375)} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>No workers registered yet. Start by adding your first worker!</Text>
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
  },
  secondaryAction: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  recentActivity: {
    marginBottom: 20,
  },
  activityCard: {
    padding: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  activityType: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
    width: '90%',
    borderLeftWidth: 5,
    borderLeftColor: Colors.warning,
  },
  notificationText: {
    fontSize: 14,
    color: Colors.warning,
    marginLeft: 8,
    flex: 1,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  statsScroll: {
    marginBottom: 32,
  },
  statsScrollContent: {
    paddingHorizontal: 10, // Add some horizontal padding for scrollable cards
  },
});