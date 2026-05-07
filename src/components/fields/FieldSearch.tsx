import React from 'react';
import { Grid, Map as MapIcon } from 'lucide-react';

interface FieldSearchProps {
  count: number;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
}

export const FieldSearch: React.FC<FieldSearchProps> = ({ count, viewMode, onViewModeChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight">Available Pitches</h1>
        <p className="text-on-surface-variant text-sm mt-1">{count} fields found near your location</p>
      </div>
      <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl">
        <button 
          onClick={() => onViewModeChange('grid')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm font-bold text-xs uppercase tracking-widest transition-colors ${viewMode === 'grid' ? 'bg-white text-on-surface' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'}`}
        >
          <Grid className="w-4 h-4" /> Grid
        </button>
        <button 
          onClick={() => onViewModeChange('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm font-bold text-xs uppercase tracking-widest transition-colors ${viewMode === 'map' ? 'bg-white text-on-surface' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'}`}
        >
          <MapIcon className="w-4 h-4" /> Map
        </button>
      </div>
    </div>
  );
};
