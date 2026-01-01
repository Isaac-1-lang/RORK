import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function VerifyPage() {
  const [message, setMessage] = useState('Verifying...');
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/verify?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.message) setMessage(data.message);
          else setMessage(data.error || 'Verification failed.');
        });
    } else {
      setMessage('No token provided.');
    }
  }, [params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>
      {message === 'Email verified. Account activated.' && (
        <Button title="Go to Login" onPress={() => router.push('/(auth)/index')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
}); 