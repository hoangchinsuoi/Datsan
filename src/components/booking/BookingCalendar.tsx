import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/format';

interface BookingCalendarProps {
  selectedDate: number;
  onSelectDate: (day: number) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ selectedDate, onSelectDate }) => {
  return (
    <section className="bg-white stadium-shadow rounded-[2.5rem] p-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black font-headline flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">1</div>
          Select Match Date
        </h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-surface-container-low rounded-xl transition-colors border border-outline-variant/10"><ChevronLeft className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-surface-container-low rounded-xl transition-colors border border-outline-variant/10"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-2">{day}</div>
        ))}
        {Array.from({ length: 14 }).map((_, i) => {
          const day = i + 1;
          const isSelected = selectedDate === day;
          const isToday = day === 5;
          return (
            <button 
              key={i}
              onClick={() => onSelectDate(day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-2xl transition-all border-2",
                isSelected 
                  ? "bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-105" 
                  : "bg-surface-container-lowest border-transparent hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              <span className="text-lg font-black">{day}</span>
              {isToday && <span className={cn("text-[8px] uppercase font-black tracking-tighter", isSelected ? "text-white/80" : "text-primary")}>Today</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
};
