import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, MapPin, Calendar, Clock, Share2, Download, ShieldCheck, Info } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/format';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    fieldName: string;
    date: string;
    time: string;
    location: string;
    price: number;
    status: string;
  };
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, booking }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
          >
            {/* Ticket Header */}
            <div className="bg-primary p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-headline leading-none">Digital Ticket</h3>
                  <p className="text-xs opacity-70 mt-1 font-bold uppercase tracking-widest">Booking ID: {booking.id}</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest">Valid Entry</span>
                </div>
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Show at Entrance</span>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-8 space-y-8">
              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="p-4 bg-surface-container-low rounded-[2.5rem] border-2 border-outline-variant/10 shadow-inner mb-4">
                  <div className="bg-white p-4 rounded-3xl shadow-sm">
                    <QrCode className="w-32 h-32 text-on-surface" />
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Scan to Check-in</p>
              </div>

              {/* Match Details */}
              <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Venue
                  </p>
                  <p className="font-bold text-sm leading-tight">{booking.fieldName}</p>
                  <p className="text-[10px] text-on-surface-variant">{booking.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Date
                  </p>
                  <p className="font-bold text-sm">{booking.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Kick-off
                  </p>
                  <p className="font-bold text-sm">{booking.time}</p>
                  <p className="text-[10px] text-on-surface-variant">90 Min Session</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                    <Info className="w-3 h-3" /> Pitch Type
                  </p>
                  <p className="font-bold text-sm">Premium 5G Turf</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Important Instructions</p>
                <ul className="text-[11px] text-on-surface-variant space-y-2 font-medium">
                  <li className="flex gap-2">• Arrive 15 minutes before kick-off for check-in.</li>
                  <li className="flex gap-2">• Only non-metal studs or turf shoes allowed.</li>
                  <li className="flex gap-2">• Water and bibs available at the reception.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 py-4 rounded-2xl shadow-lg shadow-primary/10">
                  <Download className="w-4 h-4 mr-2" /> Save to Phone
                </Button>
                <Button variant="outline" className="px-5 rounded-2xl">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Ticket Footer (Perforated look) */}
            <div className="relative h-8 bg-surface-container-low flex items-center justify-center overflow-hidden">
              <div className="absolute -left-4 w-8 h-8 bg-white rounded-full" />
              <div className="absolute -right-4 w-8 h-8 bg-white rounded-full" />
              <div className="w-full border-t-2 border-dashed border-outline-variant/20" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
