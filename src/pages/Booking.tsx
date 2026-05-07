import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cn } from '../utils/format';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  CreditCard, 
  Users, 
  ArrowRight,
  Info,
  Zap,
  Coffee,
  UserCheck
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

import { BookingCalendar } from '../components/booking/BookingCalendar';
import type { Field } from '../types';
import { fieldService } from '../services/fieldService';
import { bookingService } from '../services/bookingService';
import { calendarCellToIsoDate, slotLabelToStartEnd, getCalendarDates } from '../utils/bookingTime';
import { AvailableSlot } from '../utils/apiMappers';
import { useAuth } from '../hooks/useAuth';
import { formatVnd } from '../utils/format';

const BookingPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [field, setField] = React.useState<Field | null>(null);
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<number>(5);
  const [availableSlots, setAvailableSlots] = React.useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<AvailableSlot | null>(null);
  const [isBooked, setIsBooked] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'credits'>('card');
  const [addons, setAddons] = React.useState<{id: string, name: string, price: number}[]>([]);
  const [matchInfo, setMatchInfo] = React.useState({
    teamName: '',
    matchType: 'Friendly',
    isPublic: false
  });
  const [teammates, setTeammates] = React.useState<string[]>([]);
  const [newTeammate, setNewTeammate] = React.useState('');
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    let c = false;
    (async () => {
      try {
        const f = await fieldService.getFieldById(id);
        if (c) return;
        setField(f ?? null);
        if (!f) setFieldError('Không tìm thấy sân.');
      } catch (e) {
        if (!c) setFieldError(e instanceof Error ? e.message : 'Lỗi tải sân.');
      }
    })();
    return () => { c = true; };
  }, [id]);

  React.useEffect(() => {
    if (!field || !id) return;
    const date = calendarCellToIsoDate(selectedDate);
    let c = false;
    (async () => {
      setLoadingSlots(true);
      try {
        const slots = await bookingService.getAvailableSlots(id, date);
        if (!c) {
          setAvailableSlots(slots);
          setSelectedSlot(null);
        }
      } catch (err) {
        console.error("Failed to load slots:", err);
      } finally {
        if (!c) setLoadingSlots(false);
      }
    })();
    return () => { c = true; };
  }, [field, id, selectedDate]);

  if (!field && !fieldError) {
    return <div className="max-w-7xl mx-auto px-8 py-24 text-center font-bold text-on-surface-variant">Đang tải…</div>;
  }
  if (fieldError || !field) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <p className="text-red-600 font-bold mb-4">{fieldError ?? 'Không tìm thấy sân.'}</p>
        <Button onClick={() => navigate('/search')}>Về danh sách sân</Button>
      </div>
    );
  }

  const toggleAddon = (addon: {id: string, name: string, price: number}) => {
    setAddons(prev => 
      prev.find(a => a.id === addon.id) 
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const addTeammate = () => {
    if (newTeammate && !teammates.includes(newTeammate)) {
      setTeammates([...teammates, newTeammate]);
      setNewTeammate('');
    }
  };

  const subtotal = field.price + addons.reduce((acc, curr) => acc + curr.price, 0);
  const lightingFee = 0;
  const serviceFee = 0;
  const total = subtotal + lightingFee + serviceFee;

  const handleBooking = async () => {
    if (!selectedSlot || !agreedToTerms) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBookingError(null);
    try {
      const bookingDate = calendarCellToIsoDate(selectedDate);
      const newBooking = await bookingService.createBooking({
        fieldId: Number(field.id),
        bookingDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        note: matchInfo.teamName ? `Đội: ${matchInfo.teamName}` : undefined,
      });

      if (paymentMethod === 'card') {
        const vnpayData = await bookingService.createVnpayPaymentUrl(newBooking.id.toString(), {
          orderInfo: `Thanh toan dat san ${field.name}`,
        });
        window.location.href = vnpayData.paymentUrl;
        return;
      }

      setIsBooked(true);
    } catch (e) {
      setBookingError(e instanceof Error ? e.message : "Đặt sân thất bại.");
    }
  };

  if (isBooked) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-xl w-full bg-white stadium-shadow rounded-[3.5rem] overflow-hidden"
        >
          <div className="bg-primary p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-black font-headline mb-2 relative z-10">Match Ready!</h2>
            <p className="opacity-80 font-medium relative z-10">Your reservation is confirmed and ready for kick-off.</p>
          </div>

          <div className="p-12">
            <div className="bg-surface-container-low rounded-3xl p-8 mb-8 space-y-6">
              <div className="flex justify-between items-start pb-6 border-b border-outline-variant/10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Booking ID</p>
                  <p className="text-lg font-black text-primary">#BK-92841</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Status</p>
                  <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Confirmed</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Match Date</p>
                  <p className="font-bold">
                    {getCalendarDates().find(d => d.cellId === selectedDate)?.dayName}, {getCalendarDates().find(d => d.cellId === selectedDate)?.monthName} {getCalendarDates().find(d => d.cellId === selectedDate)?.label}th
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Time Slot</p>
                  <p className="font-bold">{selectedSlot?.time}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Pitch</p>
                  <p className="font-bold">{field.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Team</p>
                  <p className="font-bold">{matchInfo.teamName || 'The Pitchers'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant">Payment Verified</p>
                </div>
                <p className="text-2xl font-black font-headline text-on-surface">{formatVnd(total)} ₫</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/bookings')} className="w-full py-5 text-lg shadow-xl shadow-primary/20">
                Go to My Bookings
              </Button>
              <Link to="/">
                <Button variant="ghost" className="w-full py-4">Return to Home</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface mb-4">Finalize Booking</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg">
            You're booking <span className="font-bold text-on-surface">{field.name}</span>. 
            Review your details and confirm your reservation.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low px-6 py-3 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest leading-tight">
            Free Cancellation<br/><span className="text-on-surface">Until 24h Before</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Step 1: Date Selection */}
          <BookingCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          {/* Step 2: Time Slots */}
          <section className="bg-white stadium-shadow rounded-[2.5rem] p-10">
            <h2 className="text-2xl font-black font-headline flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">2</div>
              Available Time Slots
            </h2>
            {loadingSlots ? (
               <div className="text-center py-12 text-on-surface-variant font-bold">Checking availability...</div>
            ) : availableSlots.length === 0 ? (
               <div className="text-center py-12 text-on-surface-variant italic">No sessions available for this date.</div>
            ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {availableSlots.map((slot, i) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button 
                    key={i}
                    disabled={!!slot.status}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "p-6 rounded-[1.5rem] flex flex-col items-center gap-1 transition-all border-2",
                      isSelected 
                        ? "bg-secondary border-secondary text-white shadow-xl shadow-secondary/30 scale-105" : 
                      slot.status 
                        ? "bg-surface-container-low border-transparent opacity-40 cursor-not-allowed" :
                        "bg-surface-container-low border-transparent hover:border-secondary/30 hover:bg-secondary/5"
                    )}
                  >
                    <span className="text-base font-black">{slot.time}</span>
                    <span className={cn("text-[10px] uppercase font-bold tracking-widest", isSelected ? "text-white/80" : "text-on-surface-variant")}>
                      {slot.status || slot.price}
                    </span>
                  </button>
                );
              })}
            </div>
            )}
          </section>

          {/* Step 3: Match Details */}
          <section className="bg-white stadium-shadow rounded-[2.5rem] p-10">
            <h2 className="text-2xl font-black font-headline flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">3</div>
              Match Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1 mb-2 block">Team Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your team name..."
                    value={matchInfo.teamName}
                    onChange={(e) => setMatchInfo({...matchInfo, teamName: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1 mb-2 block">Match Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Friendly', 'Training', 'Competitive'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setMatchInfo({...matchInfo, matchType: type})}
                        className={cn(
                          "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          matchInfo.matchType === type ? "bg-primary text-white border-primary" : "bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container-high"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1 mb-2 block">Invite Teammates</label>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Teammate's email..."
                    value={newTeammate}
                    onChange={(e) => setNewTeammate(e.target.value)}
                    className="flex-1 bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                  <Button onClick={addTeammate} className="rounded-2xl px-6">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {teammates.map(email => (
                    <span key={email} className="bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
                      {email}
                      <button onClick={() => setTeammates(teammates.filter(t => t !== email))} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                  {teammates.length === 0 && <p className="text-xs text-on-surface-variant italic">No teammates invited yet.</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Step 4: Add-ons */}
          <section className="bg-white stadium-shadow rounded-[2.5rem] p-10">
            <h2 className="text-2xl font-black font-headline flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">4</div>
              Enhance Your Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'ref', name: 'Pro Referee', price: 25, icon: UserCheck, desc: 'FA Qualified Official' },
                { id: 'water', name: 'Hydration Pack', price: 12, icon: Coffee, desc: '12x Mineral Water' },
                { id: 'bibs', name: 'Premium Bibs', price: 8, icon: Zap, desc: 'Clean, pro-grade bibs' }
              ].map((addon) => {
                const isActive = addons.find(a => a.id === addon.id);
                return (
                  <button 
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={cn(
                      "p-6 rounded-3xl text-left transition-all border-2 flex flex-col gap-4",
                      isActive 
                        ? "bg-primary/5 border-primary shadow-lg" 
                        : "bg-surface-container-low border-transparent hover:border-primary/20"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isActive ? "bg-primary text-white" : "bg-surface-container-highest text-primary")}>
                      <addon.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-lg">{addon.name}</p>
                      <p className="text-xs text-on-surface-variant mb-2">{addon.desc}</p>
                      <p className="text-primary font-black">{formatVnd(addon.price)} ₫</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <aside className="sticky top-28 space-y-6">
            <div className="bg-on-surface text-surface rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="text-2xl font-black font-headline mb-8 relative z-10">Booking Summary</h3>
              
              <div className="space-y-8 mb-10 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-surface/50 mb-1">Venue</p>
                    <p className="font-bold text-sm leading-tight">{field.name}</p>
                    <p className="text-xs opacity-60">{field.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-surface/50 mb-1">Match Day</p>
                    <p className="font-bold text-sm">
                      {getCalendarDates().find(d => d.cellId === selectedDate)?.dayName}, {getCalendarDates().find(d => d.cellId === selectedDate)?.monthName} {getCalendarDates().find(d => d.cellId === selectedDate)?.label}th, {getCalendarDates().find(d => d.cellId === selectedDate)?.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-surface/50 mb-1">Time Slot</p>
                    <p className="font-bold text-sm">{selectedSlot?.time || 'Not selected'}</p>
                    <p className="text-xs opacity-60">90 Minutes Session</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4 relative z-10">
                <div className="flex justify-between text-sm opacity-70">
                  <span>Base Pitch Rental</span>
                  <span>{formatVnd(field.price)} ₫</span>
                </div>
                {addons.map(addon => (
                  <div key={addon.id} className="flex justify-between text-sm opacity-70">
                    <span>{addon.name}</span>
                    <span>{formatVnd(addon.price)} ₫</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm opacity-70">
                  <span>Night Lighting Fee</span>
                  <span>{formatVnd(lightingFee)} ₫</span>
                </div>
                <div className="flex justify-between text-sm opacity-70">
                  <span>Service Fee</span>
                  <span>{formatVnd(serviceFee)} ₫</span>
                </div>
                
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Total Amount</p>
                    <span className="text-4xl font-black font-headline">{formatVnd(total)} ₫</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-surface/40">Inc. VAT</p>
                  </div>
                </div>
              </div>

                <div className="mt-10 space-y-6">
                {bookingError && (
                  <p className="text-xs font-bold text-red-200 px-2">{bookingError}</p>
                )}
                <div className="flex items-center gap-3 px-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-[10px] font-bold text-surface/60 leading-tight">
                    I agree to the <span className="text-white underline cursor-pointer">Pitch Rules</span> and <span className="text-white underline cursor-pointer">Cancellation Policy</span>.
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                      paymentMethod === 'card' ? "bg-white text-on-surface border-white" : "bg-transparent text-white border-white/20 hover:bg-white/5"
                    )}
                  >
                    VNPay (QR)
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('credits')}
                    className={cn(
                      "py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                      paymentMethod === 'credits' ? "bg-white text-on-surface border-white" : "bg-transparent text-white border-white/20 hover:bg-white/5"
                    )}
                  >
                    Credits
                  </button>
                </div>
                <Button 
                  variant="secondary" 
                  disabled={!selectedSlot || !agreedToTerms}
                  onClick={handleBooking}
                  className="w-full py-5 text-lg shadow-xl shadow-secondary/20 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            
            <div className="bg-secondary/10 rounded-[2rem] p-8 flex items-center gap-6 border border-secondary/20">
              <div className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0 shadow-lg shadow-secondary/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="font-black font-headline text-secondary">Secure Checkout</p>
                <p className="text-xs text-on-surface-variant font-medium">Encrypted payment processing by Stripe.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
