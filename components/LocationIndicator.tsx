import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface LocationIndicatorProps {
  isAtWorkLocation: boolean;
}

const LocationIndicator: React.FC<LocationIndicatorProps> = ({ isAtWorkLocation }) => {
  return (
    <View style={styles.container}>
      <View
        style={[styles.indicator, { backgroundColor: isAtWorkLocation ? Colors.success : Colors.error }]}
      />
      <Text style={[styles.text, { color: isAtWorkLocation ? Colors.success : Colors.error }]}> 
        {isAtWorkLocation ? 'At Work Location' : 'Not at Work Location'}
      </Text>
    </View>
  );
};

export default LocationIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});
