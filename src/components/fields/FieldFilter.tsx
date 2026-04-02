import React from 'react';
import { Search, Star } from 'lucide-react';

export const FieldFilter: React.FC = () => {
  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="sticky top-28 space-y-12">
        <h2 className="font-headline text-xl font-black mb-10 flex items-center gap-3">
          <Search className="text-primary w-6 h-6" /> Filters
        </h2>
        
        <div className="space-y-12">
          {/* Price Range */}
          <div className="space-y-8">
            <label className="block font-headline font-black text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Price Range</label>
            <div className="px-1">
              <div className="relative h-1 w-full bg-surface-container-high rounded-full">
                <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg cursor-pointer" />
              </div>
              <div className="flex justify-between mt-6 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
                <span>£20/hr</span>
                <span>£200/hr</span>
              </div>
            </div>
          </div>

          {/* Field Type */}
          <div className="space-y-6">
            <label className="block font-headline font-black text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Field Type</label>
            <div className="space-y-4">
              {['Natural Grass', 'Hybrid Turf', 'Artificial Astro', 'Indoor Futsal', 'Urban Cage'].map((type) => (
                <label key={type} className="flex items-center gap-4 group cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-2 border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer appearance-none checked:bg-primary checked:border-primary" 
                  />
                  <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Area */}
          <div className="space-y-6">
            <label className="block font-headline font-black text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Area</label>
            <div className="space-y-4">
              {['North', 'South', 'East', 'West', 'Central'].map((area) => (
                <label key={area} className="flex items-center gap-4 group cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-2 border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer appearance-none checked:bg-primary checked:border-primary" 
                  />
                  <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-6">
            <label className="block font-headline font-black text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Rating</label>
            <div className="w-full flex items-center justify-between px-6 py-4 bg-surface-container-low rounded-full text-xs font-black transition-all">
              <span className="flex items-center gap-2">4.5+ <Star className="w-3 h-3 fill-primary text-primary" /></span>
              <span className="text-[10px] text-on-surface-variant opacity-60">12 fields</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
