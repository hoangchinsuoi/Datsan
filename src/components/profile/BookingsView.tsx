import React from "react";
import { Star, MessageSquare, ArrowRight, Calendar } from "lucide-react";
import { Button } from "../common/Button";
import { cn } from "../../utils/format";
import { ReviewModal } from "../ReviewModal";
import { CancelModal } from "../auth/CancelModal";
import { TicketModal } from "../booking/BookingModal";
import { MyBookingsList } from "../booking/MyBookingsList";
import { useBookings } from "../../hooks/useBookings";
import { useAuth } from "../../hooks/useAuth";
import type { Booking } from "../../types";
import { bookingService } from "../../services/bookingService";
import { Link } from "react-router-dom";

export const BookingsView: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { bookings, loading, error, refetch } = useBookings(isAuthenticated);
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);
  const [isTicketOpen, setIsTicketOpen] = React.useState(false);
  const [reviewBooking, setReviewBooking] = React.useState<Booking | null>(null);
  const [cancelBooking, setCancelBooking] = React.useState<Booking | null>(null);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [payingBookingId, setPayingBookingId] = React.useState<string | null>(null);

  const handlePayWithVnpay = async (booking: Booking) => {
    setPayingBookingId(booking.id);
    try {
      const data = await bookingService.createVnpayPaymentUrl(booking.id, {
        orderInfo: `Thanh toan booking #${booking.id}`,
      });
      window.location.href = data.paymentUrl;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Không thể tạo link thanh toán VNPay.";
      window.alert(message);
    } finally {
      setPayingBookingId(null);
    }
  };

  const handleReview = (booking: Booking) => {
    setReviewBooking(booking);
    setIsReviewOpen(true);
  };

  const handleCancel = (booking: Booking) => {
    setCancelBooking(booking);
    setIsCancelOpen(true);
  };

  const handleViewTicket = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsTicketOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-6">
        <p className="text-on-surface-variant font-medium">Đăng nhập để xem lịch đặt sân từ SQL Server.</p>
        <Link to="/login">
          <Button className="px-8">Đăng nhập</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {reviewBooking && (
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setReviewBooking(null);
          }}
          fieldId={Number(reviewBooking.fieldId)}
          fieldName={reviewBooking.fieldName}
          onSubmitted={() => void refetch()}
        />
      )}
      <CancelModal
        isOpen={isCancelOpen}
        onClose={() => {
          setIsCancelOpen(false);
          setCancelBooking(null);
        }}
        onConfirm={async () => {
          if (!cancelBooking) return;
          await bookingService.cancelBooking(cancelBooking.id);
          setIsCancelOpen(false);
          setCancelBooking(null);
          await refetch();
        }}
        bookingName={cancelBooking?.fieldName ?? ""}
      />
      {selectedBooking && (
        <TicketModal
          isOpen={isTicketOpen}
          onClose={() => {
            setIsTicketOpen(false);
            setSelectedBooking(null);
          }}
          booking={{
            id: selectedBooking.id,
            fieldName: selectedBooking.fieldName,
            date: selectedBooking.date,
            time: selectedBooking.time,
            location: selectedBooking.location || selectedBooking.fieldName,
            price: selectedBooking.amount,
            status: selectedBooking.status,
          }}
        />
      )}

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface">My Bookings</h1>
        </div>
        <p className="text-on-surface-variant text-xl max-w-2xl leading-relaxed">
          Manage your upcoming matches and review your history on the pitch.
        </p>
      </header>

      {error && <p className="text-red-600 font-bold">{error}</p>}
      {loading && <p className="text-on-surface-variant font-bold">Đang tải booking…</p>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="text-2xl font-black font-headline mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="text-primary w-6 h-6" />
              </div>
              Upcoming Matches
              <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-black tracking-widest">
                {bookings.length}
              </span>
            </h2>
            {bookings.length === 0 && !loading ? (
              <p className="text-on-surface-variant">Bạn chưa có booking nào.</p>
            ) : (
              <MyBookingsList
                bookings={bookings}
                onViewTicket={handleViewTicket}
                onCancel={handleCancel}
                onReview={handleReview}
                onPayWithVnpay={handlePayWithVnpay}
                payingBookingId={payingBookingId}
              />
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black font-headline">Recent History</h2>
              <button
                type="button"
                className="text-secondary font-black text-sm flex items-center gap-2 hover:gap-3 transition-all"
              >
                View All History <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white rounded-[2.5rem] overflow-hidden divide-y divide-outline-variant/10 border border-outline-variant/5 stadium-shadow">
              {bookings.slice(0, 5).map((b) => (
                <div
                  key={`h-${b.id}`}
                  className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-highest overflow-hidden border border-outline-variant/10">
                      <img src={b.fieldImage} alt={b.fieldName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black font-headline text-lg">{b.fieldName}</h4>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                        {b.date} • {b.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                    <span
                      className={cn(
                        "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest",
                        b.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-surface-container-highest text-on-surface-variant"
                      )}
                    >
                      {b.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 rounded-xl"
                      onClick={() => handleReview(b)}
                    >
                      <MessageSquare className="w-4 h-4" /> Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low p-10 rounded-[3rem] border border-outline-variant/10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                <Star className="w-8 h-8 fill-current" />
              </div>
              <div>
                <p className="font-black font-headline text-xl">Pro Member</p>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Dữ liệu từ SQL Server</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
