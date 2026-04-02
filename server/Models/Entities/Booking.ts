export interface Booking {
  id: string;
  fieldId: string;
  userId: string;
  date: string;
  time: string;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  paymentMethod: string;
  createdAt: Date;
}
