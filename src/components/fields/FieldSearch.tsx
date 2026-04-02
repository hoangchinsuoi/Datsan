import React from 'react';
import { Grid, Map as MapIcon } from 'lucide-react';

interface FieldSearchProps {
  count: number;
}

export const FieldSearch: React.FC<FieldSearchProps> = ({ count }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight">Available Pitches</h1>
        <p className="text-on-surface-variant text-sm mt-1">{count} fields found near your location</p>
      </div>
      <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl">
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm font-bold text-xs uppercase tracking-widest">
          <Grid className="w-4 h-4" /> Grid
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-on-surface font-bold text-xs uppercase tracking-widest transition-colors">
          <MapIcon className="w-4 h-4" /> Map
        </button>
      </div>
    </div>
  );
};
