import { apiGet, apiPost, apiDeleteRaw } from "./api";
import type { Booking } from "../types";
import { mapBookingDto, type BookingDto, mapAvailableSlotDto, type AvailableSlotDto, type AvailableSlot } from "../utils/apiMappers";

export type CreateBookingPayload = {
  fieldId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  note?: string;
};

export const bookingService = {
  async getMyBookings(): Promise<Booking[]> {
    const rows = await apiGet<BookingDto[]>("/bookings");
    return rows.map((b) => mapBookingDto(b));
  },

  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const row = await apiPost<BookingDto>("/bookings", payload);
    return mapBookingDto(row);
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await apiDeleteRaw(`/bookings/${encodeURIComponent(bookingId)}`);
  },

  async getAvailableSlots(fieldId: string, date: string): Promise<AvailableSlot[]> {
    const rows = await apiGet<AvailableSlotDto[]>(`/bookings/available-slots?fieldId=${fieldId}&date=${date}`);
    return rows.map((s) => mapAvailableSlotDto(s));
  },
};
