import type { Booking, Field } from '../types';

const PLACEHOLDER_FIELD_IMAGE =
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800';

export type FieldDto = {
  id: number;
  name: string;
  categoryName: string;
  location: string;
  pricePerHour: number;
  imageUrl?: string | null;
  description?: string | null;
  status: string;
  maxPlayers: number;
  averageRating: number;
  reviewsCount: number;
};

export function mapFieldDto(dto: FieldDto): Field {
  const rating = dto.averageRating || 0;
  return {
    id: String(dto.id),
    name: dto.name,
    location: dto.location,
    price: Number(dto.pricePerHour),
    rating,
    reviewsCount: dto.reviewsCount ?? 0,
    image: dto.imageUrl?.trim() || PLACEHOLDER_FIELD_IMAGE,
    type: dto.categoryName || 'Natural Grass',
    area: 'Central',
    amenities: ['Floodlights', 'Parking'],
    size: `${dto.maxPlayers}-a-side`,
    lighting: 'Pro LED',
    parking: 'On-site',
    description: dto.description?.trim() || '',
    maxPlayers: dto.maxPlayers,
  };
}

export type BookingDto = {
  id: number;
  fieldId: number;
  fieldName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  note?: string | null;
  createdAt: string;
  userName?: string | null;
};

const bookingStatuses = ['Confirmed', 'Pending', 'Cancelled', 'Completed'] as const;

function normalizeBookingStatus(s: string): (typeof bookingStatuses)[number] {
  const p = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  if ((bookingStatuses as readonly string[]).includes(p)) return p as (typeof bookingStatuses)[number];
  return 'Pending';
}

export function mapBookingDto(dto: BookingDto, fieldImage?: string): Booking {
  const date = dto.bookingDate;
  const time = `${dto.startTime.slice(0, 5)} – ${dto.endTime.slice(0, 5)}`;
  return {
    id: String(dto.id),
    fieldId: String(dto.fieldId),
    fieldName: dto.fieldName,
    fieldImage: fieldImage ?? PLACEHOLDER_FIELD_IMAGE,
    date,
    time,
    location: '',
    amount: Number(dto.totalPrice),
    status: normalizeBookingStatus(dto.status),
    paymentMethod: 'Card',
    userName: dto.userName || undefined,
  };
}

export type AvailableSlotDto = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
};

export interface AvailableSlot {
  time: string;
  price?: string;
  status?: string;
  startTime: string;
  endTime: string;
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

export function mapAvailableSlotDto(dto: AvailableSlotDto, currency: string = '₫'): AvailableSlot {
  const start = formatTime(dto.startTime);
  const end = formatTime(dto.endTime);
  return {
    time: `${start} - ${end}`,
    price: dto.isAvailable ? `${dto.price.toLocaleString()} ${currency}` : undefined,
    status: dto.isAvailable ? undefined : 'Reserved',
    startTime: dto.startTime,
    endTime: dto.endTime,
  };
}
