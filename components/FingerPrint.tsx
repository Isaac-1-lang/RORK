import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

interface FingerprintButtonProps {
  onPress: () => void;
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
}

const FingerprintButton: React.FC<FingerprintButtonProps> = ({
  onPress,
  label = 'Scan Fingerprint',
  isLoading = false,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.disabled : {}, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name="fingerprint" size={28} color={Colors.primary} />
        <Text style={styles.label}>{label}</Text>
        {isLoading && <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 8 }} />}
      </View>
    </TouchableOpacity>
  );
};

export default FingerprintButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});



