/**
 * Geofencing utilities for attendance verification
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Check if user is within the allowed radius of work location
 * @param userLocation User's current location
 * @param workLocation Work location coordinates
 * @param radiusMeters Allowed radius in meters (default: 50m)
 * @returns True if user is within the allowed area
 */
export const isWithinWorkArea = (
  userLocation: Coordinates,
  workLocation: Coordinates,
  radiusMeters: number = 50
): boolean => {
  const distance = calculateDistance(userLocation, workLocation);
  return distance <= radiusMeters;
};

/**
 * Format distance for display
 * @param distanceMeters Distance in meters
 * @returns Formatted distance string
 */
export const formatDistance = (distanceMeters: number): string => {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  } else {
    return `${(distanceMeters / 1000).toFixed(1)}km`;
  }
};

/**
 * Get distance status for UI display
 * @param userLocation User's current location
 * @param workLocation Work location coordinates
 * @param radiusMeters Allowed radius in meters
 * @returns Status object with distance info
 */
export const getLocationStatus = (
  userLocation: Coordinates,
  workLocation: Coordinates,
  radiusMeters: number = 50
) => {
  const distance = calculateDistance(userLocation, workLocation);
  const isWithinArea = distance <= radiusMeters;
  
  return {
    distance,
    formattedDistance: formatDistance(distance),
    isWithinArea,
    status: isWithinArea ? 'within' : 'outside',
    message: isWithinArea 
      ? `You're within the work area (${formatDistance(distance)} away)`
      : `You're outside the work area (${formatDistance(distance)} away, max ${radiusMeters}m allowed)`
  };
};