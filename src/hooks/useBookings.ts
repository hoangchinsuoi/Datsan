import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { MOCK_BOOKINGS } from '../services/api';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBookings(MOCK_BOOKINGS);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return { bookings, loading };
};
