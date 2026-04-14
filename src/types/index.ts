export interface Field {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  /** Hiển thị: thường lấy từ danh mục API */
  type: string;
  area: string;
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
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  paymentMethod: string;
}

export interface AuthUser {
  userId: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  position?: string;
  role: "user" | "admin";
}
