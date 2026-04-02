import { Field, Booking, User } from '../types';

export const MOCK_FIELDS: Field[] = [
  {
    id: '1',
    name: 'The Grand Arena',
    location: 'Manchester, Greater Manchester',
    price: 85,
    rating: 4.9,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800',
    type: 'Natural Grass',
    area: 'East',
    amenities: ['Floodlights', 'Showers', 'Parking'],
    size: 'Full 11-a-side',
    lighting: 'Pro LED',
    parking: 'Free On-site',
    description: 'The Emerald Arena offers a professional-grade playing experience in the heart of East London.'
  },
  {
    id: '2',
    name: 'Urban Turf Center',
    location: 'Chelsea, London',
    price: 60,
    rating: 4.7,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    type: 'Urban Cage',
    area: 'Central',
    amenities: ['Floodlights', 'Cafe'],
    size: '5-a-side',
    lighting: 'Standard',
    parking: 'Street',
    description: 'A modern urban cage perfect for high-intensity matches.'
  },
  {
    id: '3',
    name: 'Riverside Sports Club',
    location: 'Liverpool, Merseyside',
    price: 75,
    rating: 4.8,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800',
    type: 'Hybrid Turf',
    area: 'West',
    amenities: ['Floodlights', 'Showers', 'Parking', 'Cafe'],
    size: '7-a-side',
    lighting: 'Pro LED',
    parking: 'Private',
    description: 'Beautiful riverside location with top-tier facilities.'
  },
  {
    id: '4',
    name: 'Wembley Community Annex',
    location: 'Brent, London',
    price: 85,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    type: 'Natural Grass',
    area: 'North',
    amenities: ['Floodlights', 'Showers'],
    size: 'Full 11-a-side',
    lighting: 'Pro LED',
    parking: 'Limited',
    description: 'Professional grass pitch near the iconic stadium.'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    fieldId: '1',
    fieldName: 'Emirates Arena East',
    fieldImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400',
    date: 'Oct 12, 2024',
    time: '19:00 - 20:30',
    location: 'East London, E1 6AN',
    amount: 85,
    status: 'Confirmed',
    paymentMethod: 'Visa'
  },
  {
    id: 'b2',
    fieldId: '2',
    fieldName: 'The Loft Futsal Center',
    fieldImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400',
    date: 'Oct 18, 2024',
    time: '21:00 - 22:00',
    location: 'Manchester, M1 1BE',
    amount: 60,
    status: 'Confirmed',
    paymentMethod: 'Credits'
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Julian Alvarez',
  email: 'julian.a@pitch-editorial.com',
  phone: '+44 20 7123 4567',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  position: 'Forward',
  role: 'admin'
};
