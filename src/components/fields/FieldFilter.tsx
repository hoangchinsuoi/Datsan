import React from 'react';
import { Search, Star } from 'lucide-react';

export const FieldFilter: React.FC = () => {
  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="sticky top-28 space-y-8">
        <h2 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
          <Search className="text-primary w-5 h-5" /> Filters
        </h2>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="block font-headline font-bold text-sm uppercase tracking-wider text-on-surface-variant">Price Range</label>
            <input type="range" className="w-full accent-primary" min="20" max="200" />
            <div className="flex justify-between text-xs text-on-surface-variant font-medium">
              <span>£20/hr</span>
              <span>£200/hr</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-headline font-bold text-sm uppercase tracking-wider text-on-surface-variant">Field Type</label>
            <div className="space-y-2">
              {['Natural Grass', 'Hybrid Turf', 'Artificial Astro', 'Indoor Futsal', 'Urban Cage'].map((type) => (
                <label key={type} className="flex items-center gap-3 group cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20" />
                  <span className="text-sm font-body group-hover:text-primary transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-headline font-bold text-sm uppercase tracking-wider text-on-surface-variant">Area</label>
            <div className="space-y-2">
              {['North', 'South', 'East', 'West', 'Central'].map((area) => (
                <label key={area} className="flex items-center gap-3 group cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20" />
                  <span className="text-sm font-body group-hover:text-primary transition-colors">{area}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-headline font-bold text-sm uppercase tracking-wider text-on-surface-variant">Rating</label>
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-between px-4 py-2 bg-surface-container-low rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors">
                <span className="flex items-center gap-1">4.5+ <Star className="w-3 h-3 fill-current" /></span>
                <span className="text-xs text-on-surface-variant">12 fields</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
