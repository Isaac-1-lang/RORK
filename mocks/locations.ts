export interface WorkLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const mockWorkLocations: WorkLocation[] = [
  {
    id: 'location_1',
    name: 'Main Office',
    address: '123 Business St, San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: 'location_2',
    name: 'Branch Office',
    address: '456 Corporate Ave, San Francisco, CA',
    latitude: 37.7849,
    longitude: -122.4094
  }
];