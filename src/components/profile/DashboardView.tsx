import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Clock, Star, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { MOCK_BOOKINGS } from '../../services/api';
import { Button } from '../common/Button';
import { cn } from '../../utils/format';

export const DashboardView: React.FC = () => {
  const nextMatch = MOCK_BOOKINGS[0];

  return (
    <div className="space-y-12">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface">Dashboard</h1>
        </div>
        <p className="text-on-surface-variant text-xl max-w-2xl leading-relaxed">
          Welcome back! Here's a snapshot of your football activity and upcoming matches.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Matches Played', value: '24', icon: Trophy, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total Hours', value: '38h', icon: Clock, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Pro Rating', value: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] stadium-shadow border border-outline-variant/5 flex items-center gap-6"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-8 h-8", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{stat.label}</p>
              <p className="text-4xl font-black font-headline">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Next Match */}
        <div className="lg:col-span-7">
          <section className="bg-on-surface text-surface p-10 rounded-[3rem] relative overflow-hidden shadow-2xl h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <span className="px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                  Next Match
                </span>
                <span className="text-xs font-bold opacity-60">Starts in 2 days</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black font-headline mb-8 leading-tight">
                {nextMatch.fieldName}
              </h3>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Date & Time</p>
                    <p className="font-bold">{nextMatch.date} • {nextMatch.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Location</p>
                    <p className="font-bold">{nextMatch.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button variant="secondary" className="flex-1 py-4 rounded-2xl">View Ticket</Button>
                <Button variant="ghost" className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10">Get Directions</Button>
              </div>
            </div>
          </section>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-5">
          <section className="bg-white p-10 rounded-[3rem] stadium-shadow border border-outline-variant/5 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black font-headline">Recent Activity</h3>
              <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-6">
              {[
                { type: 'Booking', title: 'Booked Riverfront Field 4', time: '2 hours ago', icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10' },
                { type: 'Review', title: 'Reviewed The Grand Terrace', time: 'Yesterday', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { type: 'Payment', title: 'Added £50.00 Credits', time: '3 days ago', icon: Trophy, color: 'text-primary', bg: 'bg-primary/10' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", activity.bg)}>
                    <activity.icon className={cn("w-6 h-6", activity.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{activity.title}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">{activity.time}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
