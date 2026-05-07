import React from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, Star, ArrowRight, Calendar, MapPin } from "lucide-react";
import { Button } from "../common/Button";
import { cn } from "../../utils/format";
import { useBookings } from "../../hooks/useBookings";
import { useAuth } from "../../hooks/useAuth";

interface DashboardViewProps {
  onViewAll?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onViewAll }) => {
  const { isAuthenticated } = useAuth();
  const { bookings, loading } = useBookings(isAuthenticated);
  const nextMatch = bookings[0];

  return (
    <div className="space-y-12">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface">Dashboard</h1>
        </div>
        <p className="text-on-surface-variant text-xl max-w-2xl leading-relaxed">
          Welcome back! Here&apos;s a snapshot of your football activity and upcoming matches.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Matches (API)", value: String(bookings.length), icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
          { label: "Loading", value: loading ? "…" : "OK", icon: Clock, color: "text-secondary", bg: "bg-secondary/10" },
          { label: "Pro Rating", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
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
        <div className="lg:col-span-7">
          <section className="bg-on-surface text-surface p-10 rounded-[3rem] relative overflow-hidden shadow-2xl h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <span className="px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                  Next Match
                </span>
              </div>

              {!isAuthenticated && (
                <p className="opacity-80">Đăng nhập để xem booking từ SQL Server.</p>
              )}
              {isAuthenticated && !nextMatch && !loading && (
                <p className="opacity-80">Chưa có booking sắp tới.</p>
              )}
              {isAuthenticated && nextMatch && (
                <>
                  <h3 className="text-4xl md:text-5xl font-black font-headline mb-8 leading-tight">{nextMatch.fieldName}</h3>
                  <div className="space-y-6 mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Date & Time</p>
                        <p className="font-bold">
                          {nextMatch.date} • {nextMatch.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Venue</p>
                        <p className="font-bold">{nextMatch.fieldName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="secondary" className="flex-1 py-4 rounded-2xl">
                      View Ticket
                    </Button>
                    <Button variant="ghost" className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10">
                      Get Directions
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <section className="bg-white p-10 rounded-[3rem] stadium-shadow border border-outline-variant/5 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black font-headline">Recent Activity</h3>
              <button
                type="button"
                onClick={onViewAll}
                className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-6">
              {bookings.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-secondary/10">
                    <Calendar className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{b.fieldName}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                      {b.date} • {b.status}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
              {bookings.length === 0 && !loading && (
                <p className="text-sm text-on-surface-variant">No activity yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
