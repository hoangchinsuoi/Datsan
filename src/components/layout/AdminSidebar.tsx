import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Map as Stadium, Users, Settings, PlusCircle, HelpCircle, LogOut, MessageSquare, MessageCircle } from 'lucide-react';
import { cn } from '../../utils/format';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';

interface AdminSidebarProps {
  onNewFieldClick?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNewFieldClick }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [paidCount, setPaidCount] = React.useState(0);

  React.useEffect(() => {
    bookingService.getAdminBookings()
      .then(bookings => {
        setPaidCount(bookings.filter(b => b.status === 'Paid').length);
      })
      .catch(() => {});
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    { name: 'Inventory', icon: Stadium, path: '/admin/fields' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
    { name: 'Chat', icon: MessageCircle, path: '/admin/chat' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-72 bg-[#121417] text-white fixed left-0 top-0 z-50 p-6 gap-2">
      <Link to="/" className="block mb-10 px-2 group cursor-pointer transition-transform active:scale-95">
        <h1 className="text-2xl font-black text-[#2D7A1E] font-headline group-hover:text-[#359124] transition-colors">Admin Suite</h1>
        <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1 group-hover:text-white/60 transition-colors">The Pitch Editorial</p>
      </Link>
      
      <nav className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-[#146312] text-white shadow-lg shadow-green-900/20" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-6 h-6 transition-colors", isActive ? "text-white" : "text-white/40 group-hover:text-white")} />
              <span className="font-bold text-base tracking-tight flex-1">{item.name}</span>
              {item.name === 'Bookings' && paidCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {paidCount} mới
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 mb-8">
        <Button 
          onClick={onNewFieldClick}
          className="w-full py-4 bg-[#146312] hover:bg-[#1a7a17] border-none text-white flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-green-900/20 transition-all active:scale-95"
        >
          <PlusCircle className="w-5 h-5" /> 
          <span className="font-black uppercase tracking-widest text-xs">New Field</span>
        </Button>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-6">
        <button 
          onClick={() => window.open('mailto:support@datsan.vn', '_blank')}
          className="flex items-center gap-4 px-5 py-3 text-white/40 hover:text-white transition-colors group"
        >
          <HelpCircle className="w-5 h-5 group-hover:text-primary" />
          <span className="text-sm font-bold">Support</span>
        </button>
        <button 
          onClick={() => logout()}
          className="flex items-center gap-4 px-5 py-3 text-red-400/60 hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
};
