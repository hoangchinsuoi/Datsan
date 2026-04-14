import React from 'react';
import { LayoutDashboard, Calendar, Map as Stadium, Users, Settings, PlusCircle, HelpCircle, LogOut, TrendingUp, DollarSign, UserCheck, BarChart3, Search, Filter, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/format';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);
  const avatar =
    user?.avatar ??
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Dashboard Overview</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Real-time performance metrics for The Pitch Editorial ecosystem.</p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-2">
              <Calendar className="text-primary w-4 h-4" />
              <span className="text-sm font-semibold">Oct 12 - Oct 19, 2024</span>
            </div>
            <img src={avatar} alt="Admin" className="w-10 h-10 rounded-full border-2 border-white stadium-shadow" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Revenue', val: '$142,580.00', icon: DollarSign, trend: '+12.5%', color: 'text-primary' },
            { label: 'Active Players', val: '3,842', icon: UserCheck, trend: '+8.2%', color: 'text-secondary' },
            { label: 'Booking Rate', val: '94.2%', icon: BarChart3, trend: 'Stable', color: 'text-on-surface' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white stadium-shadow rounded-xl p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-lg bg-current/10", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-surface-container-high">{stat.trend}</span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black font-headline mt-1">{stat.val}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 bg-white stadium-shadow rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-lg font-bold">Revenue Growth</h4>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold rounded-full bg-surface-container-high">Weekly</button>
                <button className="px-3 py-1 text-xs font-bold rounded-full bg-primary text-white">Monthly</button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[40, 65, 85, 55, 70, 95, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-surface-container-low rounded-t-lg transition-all hover:bg-primary/20 relative group" style={{ height: `${h}%` }}>
                  {h === 85 && <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded">$24k</div>}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white stadium-shadow rounded-xl p-8">
            <h4 className="text-lg font-bold mb-8">Popular Fields</h4>
            <div className="space-y-6">
              {[
                { name: 'The Grand Arena', bookings: 142, rate: '98%' },
                { name: 'Urban Turf Center', bookings: 98, rate: '85%' },
                { name: 'Riverside Sports Club', bookings: 76, rate: '72%' },
                { name: 'Wembley Community Annex', bookings: 54, rate: '64%' }
              ].map((field, i) => (
                <div key={field.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{field.name}</span>
                    <span className="text-primary font-black">{field.rate}</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: field.rate }} />
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{field.bookings} Bookings this month</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white stadium-shadow rounded-xl p-8">
            <h4 className="text-lg font-bold mb-4">Booking Rate</h4>
            <div className="flex items-center justify-center h-48 relative">
              <div className="w-32 h-32 rounded-full border-[12px] border-surface-container-low flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-black block">94%</span>
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase">Average</span>
                </div>
              </div>
              <svg className="absolute w-32 h-32 -rotate-90">
                <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="364" strokeDashoffset="20" className="text-primary" />
              </svg>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase">Peak Hours</p>
                <p className="font-black">18:00 - 22:00</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase">Off-Peak</p>
                <p className="font-black">08:00 - 14:00</p>
              </div>
            </div>
          </div>

          <div className="bg-white stadium-shadow rounded-xl p-8">
            <h4 className="text-lg font-bold mb-6">Recent Activity</h4>
            <div className="space-y-6">
              {[
                { user: 'Marcus W.', action: 'booked', field: 'Grand Arena', time: '2m ago' },
                { user: 'Elena L.', action: 'reviewed', field: 'Urban Turf', time: '15m ago' },
                { user: 'Jordan D.', action: 'cancelled', field: 'Riverside', time: '1h ago' },
                { user: 'Sarah C.', action: 'joined', field: 'Platform', time: '3h ago' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-[10px] font-bold">
                    {activity.user.split(' ')[0][0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs">
                      <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold text-primary">{activity.field}</span>
                    </p>
                    <p className="text-[10px] text-on-surface-variant">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-on-surface text-surface rounded-xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="z-10">
              <h4 className="text-2xl font-black font-headline leading-tight">Expansion Season is Here.</h4>
              <p className="text-surface/80 text-sm mt-3">Inventory utilization is at peak capacity. Consider adding new turf slots in the West area to meet growing demand.</p>
            </div>
            <div className="z-10 mt-8 flex gap-4">
              <Button variant="ghost" className="bg-primary text-white hover:bg-primary/90">View Fleet Status</Button>
              <Button variant="ghost" className="bg-surface/10 text-surface hover:bg-surface/20">Download Report</Button>
            </div>
            <Stadium className="absolute -right-4 top-4 text-9xl opacity-10 rotate-12" />
          </div>
        </div>

        {/* Recent Bookings Table */}
        <section className="bg-white stadium-shadow rounded-xl overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-surface-container">
            <h4 className="text-xl font-black font-headline">Recent Bookings</h4>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs font-medium w-64" placeholder="Search orders..." />
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-lg"><Filter className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Field / Venue</th>
                  <th className="px-8 py-4">Date & Time</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className={cn("px-8 py-4", "text-right")}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {[
                  { name: 'Marcus Wright', field: 'Stamford Bridge Pitch B', time: 'Oct 14, 18:00', amount: '$120.00' },
                  { name: 'Elena Lopez', field: 'South Side Arena', time: 'Oct 14, 20:00', amount: '$85.00' },
                  { name: 'Jordan Davies', field: 'Grand Central Turf', time: 'Oct 15, 09:00', amount: '$150.00' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
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
                    <td className="px-8 py-5 text-sm font-bold">{row.amount}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-on-surface-variant hover:text-primary"><MoreHorizontal /></button>
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

export default Dashboard;
