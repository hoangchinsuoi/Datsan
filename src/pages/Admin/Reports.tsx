import React from 'react';
import { LayoutDashboard, Calendar, Map as Stadium, Users, Settings, HelpCircle, LogOut, Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/format';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';

const AdminBookings: React.FC = () => {
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Booking Management</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Monitor and manage all field reservations across the platform.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              Export CSV
            </Button>
            <Button className="flex items-center gap-2">
              Manual Booking
            </Button>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bookings', val: '1,284', color: 'bg-primary/10 text-primary' },
            { label: 'Pending', val: '42', color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Confirmed', val: '1,120', color: 'bg-green-100 text-green-700' },
            { label: 'Cancelled', val: '122', color: 'bg-red-100 text-red-700' }
          ].map(stat => (
            <div key={stat.label} className="bg-white stadium-shadow p-6 rounded-xl">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className={cn("text-2xl font-black font-headline", stat.color.split(' ')[1])}>{stat.val}</h4>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <section className="bg-white stadium-shadow rounded-xl overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-surface-container">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs font-medium w-64" placeholder="Search by ID, user or field..." />
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-lg"><Filter className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-white">All</button>
              <button className="px-4 py-2 text-xs font-bold rounded-lg hover:bg-surface-container-high">Today</button>
              <button className="px-4 py-2 text-xs font-bold rounded-lg hover:bg-surface-container-high">Upcoming</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-8 py-4">Booking ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Field</th>
                  <th className="px-8 py-4">Date & Time</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {[
                  { id: '#BK-8291', name: 'Marcus Wright', field: 'Stamford Bridge Pitch B', time: 'Oct 14, 18:00', status: 'Confirmed', amount: '$120.00' },
                  { id: '#BK-8292', name: 'Elena Lopez', field: 'South Side Arena', time: 'Oct 14, 20:00', status: 'Pending', amount: '$85.00' },
                  { id: '#BK-8293', name: 'Jordan Davies', field: 'Grand Central Turf', time: 'Oct 15, 09:00', status: 'Cancelled', amount: '$150.00' },
                  { id: '#BK-8294', name: 'Sarah Chen', field: 'Riverfront Field 4', time: 'Oct 15, 17:00', status: 'Confirmed', amount: '$45.00' },
                  { id: '#BK-8295', name: 'Alex Thompson', field: 'The Grand Terrace', time: 'Oct 16, 19:00', status: 'Confirmed', amount: '$200.00' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-5 text-xs font-bold text-primary">{row.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                          {row.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium">{row.field}</td>
                    <td className="px-8 py-5 text-sm">{row.time}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest",
                        row.status === 'Confirmed' ? "bg-green-100 text-green-700" :
                        row.status === 'Pending' ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold">{row.amount}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {row.status === 'Pending' && (
                          <>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminBookings;
