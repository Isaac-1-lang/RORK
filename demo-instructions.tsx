import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Card from '@/components/Card';
import { Fingerprint, MapPin, Users, Shield, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function DemoInstructionsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: 'Demo Instructions',
          headerBackTitle: 'Back',
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>RORK Attendance System</Text>
        <Text style={styles.subtitle}>
          Fingerprint Authentication + 50m Geo-Fencing Demo
        </Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Users size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Demo Credentials</Text>
        </View>
        
        <View style={styles.credentialsList}>
          <View style={styles.credentialItem}>
            <Text style={styles.credentialRole}>👷 Worker Account</Text>
            <Text style={styles.credentialText}>Email: john@company.com</Text>
            <Text style={styles.credentialText}>Password: demo</Text>
          </View>
          
          <View style={styles.credentialItem}>
            <Text style={styles.credentialRole}>👩‍💼 HR Manager Account</Text>
            <Text style={styles.credentialText}>Email: sarah@company.com</Text>
            <Text style={styles.credentialText}>Password: demo</Text>
          </View>
          
          <View style={styles.credentialItem}>
            <Text style={styles.credentialRole}>👨‍💻 Admin Account</Text>
            <Text style={styles.credentialText}>Email: mike@company.com</Text>
            <Text style={styles.credentialText}>Password: demo</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Fingerprint size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Fingerprint Authentication</Text>
        </View>
        
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>
            • <Text style={styles.bold}>Mobile:</Text> Uses device biometric authentication (fingerprint/face ID)
          </Text>
          <Text style={styles.featureItem}>
            • <Text style={styles.bold}>Web:</Text> Simulates fingerprint scanning with visual feedback
          </Text>
          <Text style={styles.featureItem}>
            • <Text style={styles.bold}>Security:</Text> Workers must authenticate before clock in/out
          </Text>
          <Text style={styles.featureItem}>
            • <Text style={styles.bold}>HR Registration:</Text> Capture worker fingerprints during registration
          </Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <MapPin size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>50m Geo-Fencing</Text>
        </View>
        
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>
            • <Text style={styles.bold}>Location Lock:</Text> Workers can only clock in/out within 50m of workplace
          </Text>
          <Text style={styles.featureItem}>
            • <Text style={styles.bold}>Real-time GPS:</Text> Uses device GPS for accurate location tracking
          </Text>
          <Text style={styles.featureItem}>
            • <Text style={styles.bold}>Distance Display:</Text> Shows exact distance from work location
          </Text>
          <Text style={styles.featureItem}>
            • <Text style={styles.bold}>Visual Feedback:</Text> Clear indicators for location status
          </Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Clock size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>How to Test Clock In/Out</Text>
        </View>
        
        <View style={styles.stepsList}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Login with worker credentials (john@company.com / demo)</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Tap "Clock In" button on home screen</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Complete fingerprint verification (use device biometric or simulated)</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Allow location access and verify you're within 50m of work</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>5</Text>
            <Text style={styles.stepText}>System processes attendance and shows success message</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Shield size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>HR Worker Registration</Text>
        </View>
        
        <View style={styles.stepsList}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Login with HR credentials (sarah@company.com / demo)</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Go to HR Dashboard → Register New Worker</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Fill worker details (name, phone, department, etc.)</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Capture work location using GPS</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>5</Text>
            <Text style={styles.stepText}>Capture worker's fingerprint for authentication</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>6</Text>
            <Text style={styles.stepText}>Submit registration - worker is now geo-locked to location</Text>
          </View>
        </View>
      </Card>

      <Card style={[styles.card, styles.noteCard]}>
        <Text style={styles.noteTitle}>📱 Platform Notes</Text>
        <Text style={styles.noteText}>
          • <Text style={styles.bold}>Mobile:</Text> Full biometric and GPS functionality{'\n'}
          • <Text style={styles.bold}>Web:</Text> Simulated fingerprint and mock GPS for demo{'\n'}
          • <Text style={styles.bold}>Permissions:</Text> App will request location and biometric access
        </Text>
      </Card>
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
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    marginBottom: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  credentialsList: {
    gap: 16,
  },
  credentialItem: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  credentialRole: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  credentialText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});