import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useLeaveRequestStore } from '@/hooks/useLeaveRequestStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { ChevronDown } from 'lucide-react-native';

const leaveTypes = [
  'Vacation',
  'Sick',
  'Personal',
  'Family',
  'Bereavement',
  'Other',
];

export default function LeaveRequestScreen() {
  const { user } = useAuthStore();
  const { submitLeaveRequest, isLoading } = useLeaveRequestStore();
  
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [showLeaveTypeDropdown, setShowLeaveTypeDropdown] = useState(false);
  const [errors, setErrors] = useState<{
    leaveType?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      leaveType?: string;
      startDate?: string;
      endDate?: string;
    } = {};
    
    if (!leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      newErrors.startDate = 'Invalid date format (YYYY-MM-DD)';
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      newErrors.endDate = 'Invalid date format (YYYY-MM-DD)';
    }
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    
    await submitLeaveRequest({
      userId: user.id,
      userName: user.name,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    
    router.back();
  };

  const selectLeaveType = (type: string) => {
    setLeaveType(type);
    setShowLeaveTypeDropdown(false);
    setErrors({ ...errors, leaveType: undefined });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Leave Type</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                errors.leaveType ? styles.inputError : null,
              ]}
              onPress={() => setShowLeaveTypeDropdown(!showLeaveTypeDropdown)}
            >
              <Text style={leaveType ? styles.dropdownText : styles.placeholder}>
                {leaveType || 'Select leave type'}
              </Text>
              <ChevronDown size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            {errors.leaveType && (
              <Text style={styles.errorText}>{errors.leaveType}</Text>
            )}
            
            {showLeaveTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {leaveTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => selectLeaveType(type)}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From</Text>
            <Input
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={(text) => {
                setStartDate(text);
                setErrors({ ...errors, startDate: undefined });
              }}
              error={errors.startDate}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To</Text>
            <Input
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={(text) => {
                setEndDate(text);
                setErrors({ ...errors, endDate: undefined });
              }}
              error={errors.endDate}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reason (Optional)</Text>
            <Input
              placeholder="Optional"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.reasonInput}
            />
          </View>
          
          <Button
            title="Submit"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.text,
  },
  placeholder: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  reasonInput: {
    height: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 16,
  },
});