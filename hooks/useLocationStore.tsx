import { create } from 'zustand';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { mockWorkLocations } from '@/mocks/locations';
import { calculateDistance, isWithinWorkArea, getLocationStatus } from '@/utils/geofancing';

interface LocationState {
  currentLocation: { latitude: number; longitude: number } | null;
  isAtWorkLocation: boolean;
  isLoading: boolean;
  error: string | null;
  checkIfAtWorkLocation: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
}

// Mock current location (simulating user is at work)
const MOCK_CURRENT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194
};



export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  isAtWorkLocation: false,
  isLoading: false,
  error: null,

  getCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (Platform.OS === 'web') {
        // Use mock location for web
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ 
          currentLocation: MOCK_CURRENT_LOCATION,
          isLoading: false 
        });
        return;
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ 
          error: 'Location permission denied',
          isLoading: false 
        });
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      set({ 
        currentLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        isLoading: false 
      });
    } catch (error) {
      console.error('Location error:', error);
      set({ 
        error: 'Failed to get current location',
        isLoading: false 
      });
    }
  },

  checkIfAtWorkLocation: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { currentLocation } = get();
      let location = currentLocation;
      
      // Get current location if not available
      if (!location) {
        await get().getCurrentLocation();
        location = get().currentLocation;
      }
      
      if (!location) {
        set({ 
          isAtWorkLocation: false,
          isLoading: false,
          error: 'Location not available'
        });
        return;
      }
      
      // Check if within 50 meters of any work location
      const workLocation = mockWorkLocations[0]; // Use first work location for demo
      const isAtWork = isWithinWorkArea(location, workLocation, 50);
      
      set({ 
        isAtWorkLocation: isAtWork,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to check work location',
        isAtWorkLocation: false,
        isLoading: false 
      });
    }
  },
}));