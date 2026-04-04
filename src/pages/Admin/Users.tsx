import React from 'react';
import { LayoutDashboard, Calendar, Map as Stadium, Users, Settings, HelpCircle, LogOut, Search, Filter, MoreHorizontal, Mail, Shield, UserX, UserCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/format';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';

const AdminUsers: React.FC = () => {
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">User Management</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Manage player accounts, roles, and platform access.</p>
          </div>
          <Button className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Invite Admin
          </Button>
        </header>

        {/* User Table */}
        <section className="bg-white stadium-shadow rounded-xl overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-surface-container">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs font-medium w-64" placeholder="Search by name, email or ID..." />
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-lg"><Filter className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-white">All Users</button>
              <button className="px-4 py-2 text-xs font-bold rounded-lg hover:bg-surface-container-high">Members</button>
              <button className="px-4 py-2 text-xs font-bold rounded-lg hover:bg-surface-container-high">Admins</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Joined Date</th>
                  <th className="px-8 py-4">Total Bookings</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {[
                  { name: 'Marcus Wright', email: 'marcus@example.com', role: 'Member', joined: 'Jan 12, 2024', bookings: 24, status: 'Active' },
                  { name: 'Elena Lopez', email: 'elena@example.com', role: 'Member', joined: 'Feb 05, 2024', bookings: 12, status: 'Active' },
                  { name: 'Jordan Davies', email: 'jordan@example.com', role: 'Admin', joined: 'Sep 30, 2023', bookings: 0, status: 'Active' },
                  { name: 'Sarah Chen', email: 'sarah@example.com', role: 'Member', joined: 'Mar 15, 2024', bookings: 8, status: 'Suspended' },
                  { name: 'Alex Thompson', email: 'alex@example.com', role: 'Member', joined: 'Apr 22, 2024', bookings: 5, status: 'Active' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-bold text-sm">
                          {row.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="text-sm font-bold block">{row.name}</span>
                          <span className="text-xs text-on-surface-variant">{row.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5">
                        {row.role === 'Admin' ? <Shield className="w-3.5 h-3.5 text-secondary" /> : <Users className="w-3.5 h-3.5 text-on-surface-variant" />}
                        <span className="text-sm font-medium">{row.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm">{row.joined}</td>
                    <td className="px-8 py-5 text-sm font-bold">{row.bookings}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest",
                        row.status === 'Active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"><Mail className="w-4 h-4" /></button>
                        {row.status === 'Active' ? (
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><UserX className="w-4 h-4" /></button>
                        ) : (
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><UserCheck className="w-4 h-4" /></button>
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

export default AdminUsers;
