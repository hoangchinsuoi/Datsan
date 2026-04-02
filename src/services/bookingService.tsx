import { MOCK_BOOKINGS } from './api';

export const bookingService = {
  getBookings: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_BOOKINGS;
  },
  createBooking: async (bookingData: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: Math.random().toString(36).substr(2, 9), ...bookingData };
  },
  cancelBooking: async (bookingId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};
