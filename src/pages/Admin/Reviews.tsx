import React from 'react';
import { LayoutDashboard, Calendar, Map as Stadium, Users, Settings, HelpCircle, LogOut, Star, MessageSquare, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/format';
import { Link } from 'react-router-dom';

const AdminReviews: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-on-surface text-surface fixed left-0 top-0 z-50 p-4 gap-2">
        <div className="mb-8 px-4 py-2">
          <Link to="/admin" className="text-xl font-bold text-primary font-headline">Admin Suite</Link>
          <p className="text-xs opacity-60 font-medium">The Pitch Editorial</p>
        </div>
        
        <nav className="flex flex-col gap-1 flex-grow">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
            { name: 'Bookings', icon: Calendar, path: '/admin/bookings' },
            { name: 'Inventory', icon: Stadium, path: '/admin/fields' },
            { name: 'Users', icon: Users, path: '/admin/users' },
            { name: 'Reviews', icon: MessageSquare, path: '/admin/reviews', active: true },
            { name: 'Settings', icon: Settings, path: '/admin/settings' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-surface/60 hover:bg-surface/10"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-surface/10 pt-4">
          <button className="flex items-center gap-3 px-4 py-2 text-surface/60 hover:text-surface">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">Support</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 lg:p-12">
        <header className="mb-12">
          <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Review Management</h2>
          <p className="text-on-surface-variant mt-2 font-medium">Monitor player feedback and manage platform reputation.</p>
        </header>

        {/* Reviews List */}
        <div className="grid grid-cols-1 gap-6">
          {[
            { user: 'Marcus Wright', field: 'Stamford Bridge Pitch B', rating: 5, comment: 'Absolutely incredible pitch. The turf quality is professional grade and the floodlights are perfect for late night matches.', date: '2 days ago', status: 'Published' },
            { user: 'Elena Lopez', field: 'South Side Arena', rating: 4, comment: 'Great facilities, but the parking was a bit tight. The field itself is top notch though.', date: '4 days ago', status: 'Pending' },
            { user: 'Jordan Davies', field: 'Grand Central Turf', rating: 2, comment: 'The pitch was a bit slippery today. Might need some maintenance.', date: '1 week ago', status: 'Flagged' },
            { user: 'Sarah Chen', field: 'Riverfront Field 4', rating: 5, comment: 'Best value for money in the city. Easy booking process and friendly staff.', date: '1 week ago', status: 'Published' }
          ].map((review, i) => (
            <div key={i} className="bg-white stadium-shadow rounded-2xl p-8 flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface font-black text-xl">
                  {review.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-secondary fill-current" : "text-surface-container-highest")} />
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black font-headline text-lg">{review.user}</h4>
                    <p className="text-sm text-on-surface-variant">Reviewed <span className="font-bold text-primary">{review.field}</span> • {review.date}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest",
                    review.status === 'Published' ? "bg-green-100 text-green-700" :
                    review.status === 'Pending' ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                  )}>
                    {review.status}
                  </span>
                </div>
                <p className="text-on-surface italic leading-relaxed">"{review.comment}"</p>
                
                <div className="mt-6 flex justify-end gap-3 border-t border-surface-container pt-6">
                  {review.status !== 'Published' && (
                    <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    </Button>
                  )}
                  {review.status !== 'Flagged' && (
                    <Button variant="ghost" size="sm" className="text-yellow-600 hover:bg-yellow-50">
                      <XCircle className="w-4 h-4 mr-2" /> Flag
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminReviews;
