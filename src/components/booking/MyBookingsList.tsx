import React from 'react';
import { Calendar, Clock, MapPin, Ticket, CloudRain, Share2, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/format';
import { Booking } from '../../types';

interface MyBookingsListProps {
  bookings: Booking[];
  onViewTicket: (booking: Booking) => void;
  onCancel: (fieldName: string) => void;
  onReview: (fieldName: string) => void;
}

export const MyBookingsList: React.FC<MyBookingsListProps> = ({ bookings, onViewTicket, onCancel, onReview }) => {
  return (
    <div className="space-y-6">
      {bookings.map(booking => (
        <div key={booking.id} className="bg-surface-container-lowest stadium-shadow rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row group transition-all hover:translate-y-[-4px]">
          <div className="w-full md:w-64 h-64 md:h-auto overflow-hidden relative">
            <img src={booking.fieldImage} alt={booking.fieldName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <Button onClick={() => onViewTicket(booking)} size="sm" className="w-full bg-white text-primary hover:bg-white/90">
                <Ticket className="w-4 h-4 mr-2" /> View Ticket
              </Button>
            </div>
          </div>
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    {booking.status}
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">
                    <CloudRain className="w-3 h-3 mr-1" /> 22°C • Clear
                  </div>
                </div>
                <h3 className="text-2xl font-black font-headline mb-1 leading-tight">{booking.fieldName}</h3>
                <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm font-medium">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {booking.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {booking.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {booking.location}</span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-3xl font-black font-headline text-on-surface">£{booking.amount}.00</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Paid via {booking.paymentMethod}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  className="bg-surface-container-high rounded-xl px-6"
                  onClick={() => onViewTicket(booking)}
                >
                  <Ticket className="w-4 h-4 mr-2" /> Digital Ticket
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:bg-red-50 rounded-xl"
                  onClick={() => onCancel(booking.fieldName)}
                >
                  Cancel Match
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Kick-off in</p>
                  <p className="text-sm font-black text-primary">2d 14h 22m</p>
                </div>
                <Button variant="ghost" className="text-primary flex items-center gap-2 p-2 hover:bg-primary/5 rounded-full">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
