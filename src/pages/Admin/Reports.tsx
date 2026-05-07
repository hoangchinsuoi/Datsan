import React from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn, formatVnd } from '../../utils/format';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';
import { bookingService } from '../../services/bookingService';
import type { Booking } from '../../types';

const AdminBookings: React.FC = () => {
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAdminBookings();
      setBookings(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi khi tải danh sách booking.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Cập nhật thất bại.");
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "Pending").length,
    paid: bookings.filter(b => b.status === "Paid").length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length,
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} onCreated={() => void load()} />

      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Booking Management</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Báo cáo lượt đặt từ database real-time.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.print()}>Export PDF</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bookings', val: stats.total, color: 'text-primary' },
            { label: 'Pending', val: stats.pending, color: 'text-yellow-600' },
            { label: 'Paid', val: stats.paid, color: 'text-blue-600' },
            { label: 'Confirmed', val: stats.confirmed, color: 'text-green-600' },
            { label: 'Cancelled', val: stats.cancelled, color: 'text-red-600' }
          ].map(s => (
            <div key={s.label} className="bg-white stadium-shadow p-6 rounded-xl">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{s.label}</p>
              <h4 className={cn("text-2xl font-black font-headline", s.color)}>{s.val}</h4>
            </div>
          ))}
        </div>

        <section className="bg-white stadium-shadow rounded-xl overflow-hidden">
          {loading && <div className="p-8 text-center font-bold">Đang tải...</div>}
          {error && <div className="p-8 text-center text-red-500 font-bold">{error}</div>}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-8 py-4">ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Field</th>
                  <th className="px-8 py-4">Date & Time</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-5 text-xs font-bold text-primary">#{b.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs uppercase">
                          {(b.userName || 'U')[0]}
                        </div>
                        <span className="text-sm font-bold">{b.userName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium">{b.fieldName}</td>
                    <td className="px-8 py-5 text-sm">{b.bookingDate} {b.startTime}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest",
                        b.status === 'Confirmed' ? "bg-green-100 text-green-700" :
                        b.status === 'Paid' ? "bg-blue-100 text-blue-700" :
                        b.status === 'Pending' ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      )}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold">{formatVnd(Number(b.amount))} ₫</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {(b.status === 'Pending' || b.status === 'Paid') && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(b.id, "Confirmed")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Duyệt đơn"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(b.id, "Cancelled")}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Hủy đơn"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && !loading && (
                  <tr><td colSpan={7} className="px-8 py-20 text-center text-on-surface-variant font-medium">Chưa có đơn đặt sân nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminBookings;
