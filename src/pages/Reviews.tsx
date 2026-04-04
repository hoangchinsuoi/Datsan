import React from 'react';
import { Star, MessageSquare, ArrowRight } from 'lucide-react';
import { MOCK_BOOKINGS } from '../services/api';
import { Button } from '../components/common/Button';
import { cn } from '../utils/format';
import { ReviewModal } from '../components/ReviewModal';
import { CancelModal } from '../components/auth/CancelModal';
import { TicketModal } from '../components/booking/BookingModal';

import { MyBookingsList } from '../components/booking/MyBookingsList';

const MyBookings: React.FC = () => {
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);
  const [isTicketOpen, setIsTicketOpen] = React.useState(false);
  const [selectedField, setSelectedField] = React.useState('');
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);

  const handleReview = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsReviewOpen(true);
  };

  const handleCancel = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsCancelOpen(true);
  };

  const handleViewTicket = (booking: any) => {
    setSelectedBooking(booking);
    setIsTicketOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        fieldName={selectedField} 
      />
      <CancelModal 
        isOpen={isCancelOpen} 
        onClose={() => setIsCancelOpen(false)} 
        onConfirm={() => setIsCancelOpen(false)} 
        bookingName={selectedField} 
      />
      {selectedBooking && (
        <TicketModal 
          isOpen={isTicketOpen}
          onClose={() => setIsTicketOpen(false)}
          booking={{
            id: selectedBooking.id,
            fieldName: selectedBooking.fieldName,
            date: selectedBooking.date,
            time: selectedBooking.time,
            location: selectedBooking.location,
            price: selectedBooking.amount,
            status: selectedBooking.status
          }}
        />
      )}

      <header className="mb-12">
        <h1 className="text-5xl font-black font-headline tracking-tighter text-on-surface mb-2">Your Bookings</h1>
        <p className="text-on-surface-variant text-lg">Manage your upcoming matches and review your history on the pitch.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
              Upcoming Matches
              <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">{MOCK_BOOKINGS.length}</span>
            </h2>
            <MyBookingsList 
              bookings={MOCK_BOOKINGS} 
              onViewTicket={handleViewTicket} 
              onCancel={handleCancel} 
              onReview={handleReview} 
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black font-headline">Recent History</h2>
              <button className="text-secondary font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">
                View All History <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-surface-container-low rounded-[2.5rem] overflow-hidden divide-y divide-outline-variant/10 border border-outline-variant/5">
              {[
                { name: 'Riverfront Field 4', date: 'Sep 24, 2024', status: 'Completed', price: '£45.00', image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=200' },
                { name: 'The Grand Terrace', date: 'Sep 12, 2024', status: 'Completed', price: '£120.00', image: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=200' },
                { name: 'Downtown 5-a-side', date: 'Aug 30, 2024', status: 'Cancelled', price: '£0.00', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=200' }
              ].map((item, i) => (
                <div key={i} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-surface-container transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-highest overflow-hidden border border-outline-variant/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black font-headline text-lg">{item.name}</h4>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{item.date} • 90 MINS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={cn(
                      "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest",
                      item.status === 'Cancelled' ? "bg-red-100 text-red-700" : "bg-surface-container-highest text-on-surface-variant"
                    )}>{item.status}</span>
                    <span className="font-black text-on-surface text-lg">{item.price}</span>
                    <div className="flex gap-2">
                      {item.status === 'Completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2 rounded-xl"
                          onClick={() => handleReview(item.name)}
                        >
                          <MessageSquare className="w-4 h-4" /> Review
                        </Button>
                      )}
                      <Button variant={item.status === 'Cancelled' ? 'secondary' : 'outline'} size="sm" className="rounded-xl">
                        Re-book
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-on-surface text-surface p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2 relative z-10">Season Stats</p>
            <h3 className="text-4xl font-black font-headline mb-8 relative z-10">Match Ready</h3>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <span className="text-4xl font-black block mb-1">24</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Matches Played</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <span className="text-4xl font-black block mb-1">38h</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Time</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full mt-8 py-4 rounded-2xl shadow-xl shadow-secondary/20">
              View Full Stats
            </Button>
          </div>

          <div className="bg-surface-container-low p-10 rounded-[3rem] border border-outline-variant/10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                <Star className="w-8 h-8 fill-current" />
              </div>
              <div>
                <p className="font-black font-headline text-xl">Pro Member</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Valid until Dec 2024</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Credits Remaining</p>
                  <span className="text-3xl font-black">£120.00</span>
                </div>
                <span className="text-xs font-bold text-secondary">68% Used</span>
              </div>
              <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden p-0.5">
                <div className="bg-secondary h-full w-2/3 rounded-full" />
              </div>
              <Button variant="ghost" className="w-full bg-surface-container-high py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                Top Up Credits
              </Button>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10">
            <h4 className="text-lg font-black font-headline mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button className="w-full text-left p-4 rounded-2xl hover:bg-surface-container transition-colors flex items-center justify-between group">
                <span className="text-sm font-bold">Pitch Rules & Safety</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
              <button className="w-full text-left p-4 rounded-2xl hover:bg-surface-container transition-colors flex items-center justify-between group">
                <span className="text-sm font-bold">Cancellation Policy</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
              <button className="w-full text-left p-4 rounded-2xl hover:bg-surface-container transition-colors flex items-center justify-between group">
                <span className="text-sm font-bold">Help & Support</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
