export interface Field {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  type: 'Natural Grass' | 'Hybrid Turf' | 'Artificial Astro' | 'Indoor Futsal' | 'Urban Cage';
  area: 'North' | 'South' | 'East' | 'West' | 'Central';
  amenities: string[];
  size: string;
  lighting: string;
  parking: string;
  description: string;
}

export interface Booking {
  id: string;
  fieldId: string;
  fieldName: string;
  fieldImage: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  position: string;
  role: 'user' | 'admin';
}
