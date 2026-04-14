import { useCallback, useEffect, useState } from "react";
import type { Booking } from "../types";
import { bookingService } from "../services/bookingService";

export function useBookings(enabled: boolean) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) {
      setBookings([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được booking.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { bookings, loading, error, refetch };
}
