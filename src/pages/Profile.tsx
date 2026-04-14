import React from 'react';
import { LayoutDashboard, Calendar, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/format';
import { DashboardView } from '../components/profile/DashboardView';
import { BookingsView } from '../components/profile/BookingsView';
import { SettingsView } from '../components/profile/SettingsView';
import { useAuth } from '../hooks/useAuth';

type TabType = 'dashboard' | 'bookings' | 'settings';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TabType>('settings');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'bookings':
        return <BookingsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <SettingsView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface-container-lowest">
      {/* SideNav */}
      <aside className="w-full md:w-72 bg-white flex flex-col p-6 gap-2 sticky top-20 h-auto md:h-[calc(100vh-80px)] border-r border-outline-variant/10">
        <div className="mb-10 px-4 py-2">
          <h2 className="font-black text-2xl font-headline tracking-tighter text-primary">Account Center</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">The Pitch Editorial • v2.4</p>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { id: 'bookings', name: 'My Bookings', icon: Calendar },
            { id: 'settings', name: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-primary group-hover:scale-110 transition-transform")} />
              <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-auto border-t border-outline-variant/10 pt-6 flex flex-col gap-1">
          <button className="flex items-center gap-4 px-5 py-4 text-on-surface-variant hover:bg-surface-container-low rounded-2xl transition-all group">
            <HelpCircle className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-black text-xs uppercase tracking-widest">Support</span>
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-black text-xs uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8 md:p-16 max-w-6xl">
        {renderContent()}
      </section>
    </div>
  );
};

export default Profile;
