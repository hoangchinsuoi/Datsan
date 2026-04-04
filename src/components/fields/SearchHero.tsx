import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Calendar, Search, ChevronDown, Target } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/format';

export const SearchHero: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = React.useState('');
  const [date, setDate] = React.useState('');
  const [pitchType, setPitchType] = React.useState('5-a-side');
  const [isFocused, setIsFocused] = React.useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('q', location);
    if (date) params.append('date', date);
    if (pitchType) params.append('type', pitchType);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative z-20 w-full max-w-4xl"
    >
      <form 
        onSubmit={handleSearch}
        className="bg-white/95 backdrop-blur-md p-2 md:p-3 rounded-[2.5rem] stadium-shadow flex flex-col md:flex-row gap-2 items-stretch md:items-center border border-white/20"
      >
        {/* Location Section */}
        <div 
          className={cn(
            "flex-1 flex flex-col gap-1 px-6 py-3 rounded-[2rem] transition-all cursor-pointer group",
            isFocused === 'location' ? "bg-surface-container-low shadow-inner" : "hover:bg-surface-container-lowest"
          )}
          onClick={() => setIsFocused('location')}
        >
          <span className="text-[10px] uppercase tracking-widest font-black text-primary flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Location
          </span>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Where are you playing?" 
              className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full placeholder:text-on-surface-variant/40"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setIsFocused('location')}
              onBlur={() => setIsFocused(null)}
            />
            <button 
              type="button"
              className="p-1.5 hover:bg-primary/10 rounded-full transition-colors text-primary group-hover:scale-110"
              title="Use current location"
            >
              <Target className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-outline-variant/20" />

        {/* Date Section */}
        <div 
          className={cn(
            "flex-1 flex flex-col gap-1 px-6 py-3 rounded-[2rem] transition-all cursor-pointer",
            isFocused === 'date' ? "bg-surface-container-low shadow-inner" : "hover:bg-surface-container-lowest"
          )}
          onClick={() => setIsFocused('date')}
        >
          <span className="text-[10px] uppercase tracking-widest font-black text-primary flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Date
          </span>
          <input 
            type="date" 
            className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full cursor-pointer [color-scheme:light]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={() => setIsFocused('date')}
            onBlur={() => setIsFocused(null)}
          />
        </div>

        <div className="hidden md:block w-px h-12 bg-outline-variant/20" />

        {/* Format Section */}
        <div 
          className={cn(
            "flex-1 flex flex-col gap-1 px-6 py-3 rounded-[2rem] transition-all cursor-pointer relative group",
            isFocused === 'type' ? "bg-surface-container-low shadow-inner" : "hover:bg-surface-container-lowest"
          )}
        >
          <span className="text-[10px] uppercase tracking-widest font-black text-primary flex items-center gap-1.5">
            <Target className="w-3 h-3" /> Pitch Type
          </span>
          <div className="flex items-center justify-between">
            <select 
              className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full appearance-none cursor-pointer"
              value={pitchType}
              onChange={(e) => setPitchType(e.target.value)}
              onFocus={() => setIsFocused('type')}
              onBlur={() => setIsFocused(null)}
            >
              <option value="5-a-side">5-a-side</option>
              <option value="7-a-side">7-a-side</option>
              <option value="11-a-side">11-a-side</option>
              <option value="futsal">Futsal</option>
            </select>
            <ChevronDown className="w-4 h-4 text-on-surface-variant group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Search Button */}
        <Button 
          type="submit"
          className="md:w-auto h-16 md:h-14 px-8 rounded-[1.75rem] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group overflow-hidden relative"
        >
          <motion.div
            className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          />
          <Search className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
          <span className="font-black text-sm uppercase tracking-widest relative z-10">Search</span>
        </Button>
      </form>

      {/* Quick Suggestions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Trending:</span>
        {['East London', 'Indoor', '7-a-side', 'Night Matches'].map((tag) => (
          <button 
            key={tag}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-[10px] font-bold text-white transition-all border border-white/10 hover:scale-105 active:scale-95"
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
