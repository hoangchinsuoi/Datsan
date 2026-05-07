import React from 'react';
import { Button } from '../common/Button';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingName: string;
}

export const CancelModal: React.FC<CancelModalProps> = ({ isOpen, onClose, onConfirm, bookingName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] stadium-shadow overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black font-headline tracking-tight">Cancel Match?</h3>
                <p className="text-on-surface-variant text-sm mt-2">
                  Are you sure you want to cancel your booking for <span className="font-bold text-on-surface">{bookingName}</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" onClick={onClose} className="flex-1 py-4">Keep Booking</Button>
                <Button onClick={onConfirm} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white">Yes, Cancel</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
