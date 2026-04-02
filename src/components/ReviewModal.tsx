import React from 'react';
import { Button } from './common/Button';
import { Star, X, MessageSquare } from 'lucide-react';
import { cn } from '../utils/format';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, fieldName }) => {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);

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
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] stadium-shadow overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black font-headline tracking-tight">Rate Your Match</h3>
                  <p className="text-on-surface-variant text-sm mt-1">How was your experience at <span className="font-bold text-primary">{fieldName}</span>?</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "w-10 h-10 transition-colors",
                            (hover || rating) >= star ? "text-secondary fill-current" : "text-surface-container-highest"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-secondary uppercase tracking-widest">
                    {rating === 5 ? 'Legendary' : rating === 4 ? 'Great Game' : rating === 3 ? 'Good Match' : rating === 2 ? 'Could be Better' : rating === 1 ? 'Poor Pitch' : 'Select Rating'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Your Review
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the turf quality, lighting, facilities..."
                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={onClose} className="flex-1 py-4">Cancel</Button>
                  <Button onClick={onClose} className="flex-1 py-4">Submit Review</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
