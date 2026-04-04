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
