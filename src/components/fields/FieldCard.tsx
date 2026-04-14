import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Field } from '../../types';
import { formatVnd } from '../../utils/format';

interface FieldCardProps {
  field: Field;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field }) => {
  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden stadium-shadow transition-all duration-500 border border-outline-variant/5">
      <div className="relative h-64 overflow-hidden">
        <img src={field.image} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-black text-xs shadow-xl">
          <Star className="w-3.5 h-3.5 text-orange-500 fill-current" /> {field.rating}
        </div>

        {/* Tags */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-lg w-fit">
            {field.type}
          </div>
          <div className="bg-secondary text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-lg w-fit">
            {field.area}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-headline text-2xl font-black tracking-tight text-on-surface">{field.name}</h3>
            <p className="text-on-surface-variant text-sm font-bold flex items-center gap-1.5 opacity-60">
              <MapPin className="w-3.5 h-3.5" /> {field.location}
            </p>
          </div>
          <div className="text-right">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-primary leading-none">{formatVnd(field.price)} ₫</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-1 opacity-60">per hour</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 border-t border-outline-variant/10">
          {field.amenities.map(a => (
            <span key={a} className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">
              {a}
            </span>
          ))}
        </div>

        <Link to={`/booking/${field.id}`} className="block">
          <Button className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
};
