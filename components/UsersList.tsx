import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/utils/api';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function UsersList() {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(token!),
    enabled: !!token,
  });

  if (!token) return <Text>Please log in to view users.</Text>;
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id || item.id || item.email}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text>{item.name} ({item.email})</Text>
        </View>
      )}
    />
  );
} 