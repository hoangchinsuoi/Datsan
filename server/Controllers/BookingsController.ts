import { Request, Response } from 'express';
import { ResponseHelper } from '../Helpers/ResponseHelper';

export class BookingsController {
  public async getBookings(req: Request, res: Response) {
    try {
      // Simulate fetching bookings
      const bookings = []; // Mock data or DB call
      return ResponseHelper.success(res, bookings, 'Bookings retrieved');
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  public async createBooking(req: Request, res: Response) {
    const bookingData = req.body;
    try {
      // Simulate creating booking
      const newBooking = { id: '1', ...bookingData };
      return ResponseHelper.success(res, newBooking, 'Booking created', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  public async cancelBooking(req: Request, res: Response) {
    const { id } = req.params;
    try {
      // Simulate cancelling booking
      return ResponseHelper.success(res, { id }, 'Booking cancelled');
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }
}
