import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Share2, Heart, ChevronRight, Grid, ShieldCheck, Calendar, Clock, X, Maximize2, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Button } from '../components/common/Button';
import { cn, formatVnd } from '../utils/format';

import { BookingCalendar } from '../components/booking/BookingCalendar';
import type { Field } from '../types';
import { fieldService } from '../services/fieldService';
import { reviewService, type ReviewDto } from '../services/reviewService';
import { bookingService } from '../services/bookingService';
import { AvailableSlot } from '../utils/apiMappers';
import { calendarCellToIsoDate, getCalendarDates } from '../utils/bookingTime';

const FieldDetail: React.FC = () => {
  const { id } = useParams();
  const [field, setField] = React.useState<Field | null>(null);
  const [reviews, setReviews] = React.useState<ReviewDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<number>(5);
  const [availableSlots, setAvailableSlots] = React.useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<AvailableSlot | null>(null);
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  // Gallery lightbox state
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  React.useEffect(() => {
    if (!id) {
      setLoading(false);
      setLoadError('Thiếu mã sân.');
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const f = await fieldService.getFieldById(id);
        if (cancelled) return;
        if (!f) {
          setField(null);
          setLoadError('Không tìm thấy sân.');
          return;
        }
        setField(f);
        const rev = await reviewService.listByField(Number(id));
        if (!cancelled) setReviews(rev);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Không tải được dữ liệu.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  React.useEffect(() => {
    if (!id) return;
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
  }, [id, selectedDate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center font-bold text-on-surface-variant">
        Đang tải chi tiết sân…
      </div>
    );
  }

  if (loadError || !field) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center">
        <p className="text-red-600 font-bold mb-4">{loadError ?? 'Không tìm thấy sân.'}</p>
        <Link to="/search" className="text-primary font-bold underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Gallery Section */}
      {(() => {
        // Build gallery array: main image + up to 3 extras from field.gallery
        const FALLBACKS = [
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        ];
        const extras = field.gallery.length > 0 ? field.gallery.slice(0, 3) : FALLBACKS;
        const allImages = [field.image, ...extras];

        const openLightbox = (idx: number) => { setLightboxIndex(idx); setLightboxOpen(true); };

        return (
          <section className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-12">
            {/* Main Image */}
            <div
              className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl group cursor-zoom-in"
              onClick={() => openLightbox(0)}
            >
              <img src={allImages[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {/* Gallery image 1 */}
            <div
              className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl group cursor-zoom-in"
              onClick={() => openLightbox(1)}
            >
              <img src={allImages[1]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Gallery 1" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
            {/* Gallery image 2 */}
            <div
              className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl group cursor-zoom-in"
              onClick={() => openLightbox(2)}
            >
              <img src={allImages[2]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Gallery 2" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
            {/* Gallery image 3 + Show all */}
            <div
              className="col-span-2 row-span-1 relative overflow-hidden rounded-3xl group cursor-zoom-in"
              onClick={() => openLightbox(3)}
            >
              <img src={allImages[3] ?? allImages[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Gallery 3" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <button
                onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-on-surface font-semibold flex items-center gap-2 hover:bg-white transition-colors shadow-md"
              >
                <Grid className="w-4 h-4" /> Show all photos ({allImages.length})
              </button>
            </div>
          </section>
        );
      })()}

      {/* Header Info */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant text-sm font-medium mb-4">
              <Link to="/search">Fields</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary font-bold">{field.name}</span>
            </nav>
            <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4">{field.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="font-bold text-primary">{field.rating}</span>
                <span className="text-on-surface-variant text-sm">({field.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{field.location}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="p-3 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full" /> Field Profile
            </h2>
            <p className="text-on-surface-variant leading-relaxed text-lg mb-8">{field.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Surface', val: field.type },
                { label: 'Size', val: field.size },
                { label: 'Lighting', val: field.lighting },
                { label: 'Parking', val: field.parking }
              ].map(item => (
                <div key={item.label} className="p-6 bg-surface-container-low rounded-2xl">
                  <span className="block text-on-surface-variant text-xs uppercase tracking-widest mb-1">{item.label}</span>
                  <span className="font-bold text-lg">{item.val}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full" /> Clubhouse Amenities
            </h2>
            <div className="grid grid-cols-2 gap-y-6">
              {field.amenities.map(a => (
                <div key={a} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-on-surface">{a}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full" /> Vị trí sân
            </h2>
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-surface-container-low shadow-inner border border-outline-variant/10 group">
              <iframe
                title="Bản đồ vị trí sân"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(field.location)}&output=embed`}
              ></iframe>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
              <button
                onClick={() => setIsMapOpen(true)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white hover:text-primary transition-all z-10"
              >
                <Maximize2 className="w-4 h-4" /> Phóng to bản đồ
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full" /> Đánh giá ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p className="text-on-surface-variant">Chưa có đánh giá cho sân này.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <span className="font-black">{r.userFullName}</span>
                      <span className="text-primary font-bold">{r.rating}★</span>
                    </div>
                    <p className="text-on-surface-variant text-sm">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" /> Availability
              </h2>
            </div>
            <BookingCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-8">
              {loadingSlots ? (
                <div className="col-span-full py-8 text-center text-on-surface-variant font-bold">Checking...</div>
              ) : availableSlots.length === 0 ? (
                <div className="col-span-full py-8 text-center text-on-surface-variant italic">No slots found.</div>
              ) : (
                availableSlots.map((slot) => {
                  const isBooked = !!slot.status;
                  return (
                    <button
                      key={slot.time}
                      disabled={isBooked}
                      onClick={() => !isBooked && setSelectedSlot(slot)}
                      className={cn(
                        "p-4 rounded-2xl text-xs font-bold transition-all border-2",
                        isBooked
                          ? "bg-surface-container-highest text-on-surface-variant/40 border-transparent cursor-not-allowed"
                          : selectedSlot === slot
                            ? "bg-primary text-white border-primary shadow-lg scale-105"
                            : "bg-white border-outline-variant/10 hover:border-primary hover:text-primary text-on-surface stadium-shadow"
                      )}
                    >
                      {slot.time.split(' - ')[0]}
                      {isBooked && <span className="block text-[8px] opacity-60">Booked</span>}
                    </button>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 p-8 bg-surface-container-lowest rounded-[2rem] stadium-shadow border border-outline-variant/15">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-3xl font-black text-on-surface">{formatVnd(field.price)} ₫</span>
                <span className="text-on-surface-variant font-medium">/ giờ</span>
              </div>
              <div className="flex items-center gap-1 text-sm bg-primary/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="font-bold text-primary">{field.rating}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-surface-container-low rounded-2xl">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Date</label>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {getCalendarDates().find(d => d.cellId === selectedDate)?.dayName}, {getCalendarDates().find(d => d.cellId === selectedDate)?.label} {getCalendarDates().find(d => d.cellId === selectedDate)?.monthName.slice(0, 3)}
                  </span>
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-2xl">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Time Slot</label>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{selectedSlot?.time || 'Chọn khung giờ'}</span>
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <Link to={`/booking/${field.id}`} state={{ slot: selectedSlot, dateCell: selectedDate }}>
              <Button className="w-full py-5 text-xl mb-4" variant="secondary">Book Now</Button>
            </Link>

            <p className="text-center text-xs text-on-surface-variant px-4">
              You won't be charged yet. Cancellation is free up to 24h before kick-off.
            </p>

            <div className="mt-8 pt-8 border-t border-surface-container-high">
              <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Verified and Trusted Venue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMapOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-5xl h-[80vh] rounded-[2rem] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-surface-container-lowest">
              <h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {field.location}</h3>
              <button onClick={() => setIsMapOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <iframe
              title="Bản đồ vị trí sân lớn"
              width="100%"
              height="100%"
              style={{ border: 0, flexGrow: 1 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(field.location)}&output=embed`}
            ></iframe>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (() => {
        const FALLBACKS = [
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
        ];
        const extras = field.gallery.length > 0 ? field.gallery : FALLBACKS;
        const allImages = [field.image, ...extras];
        const prev = () => setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length);
        const next = () => setLightboxIndex(i => (i + 1) % allImages.length);
        return (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-6 p-3 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors z-10"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            {/* Image */}
            <img
              src={allImages[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-h-[88vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-6 p-3 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors z-10"
            >
              <ChevronRightIcon className="w-7 h-7" />
            </button>
            {/* Counter + thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              <p className="text-white/70 text-sm font-medium">{lightboxIndex + 1} / {allImages.length}</p>
              <div className="flex gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                    className={cn(
                      'w-12 h-8 rounded-lg overflow-hidden border-2 transition-all',
                      idx === lightboxIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default FieldDetail;
