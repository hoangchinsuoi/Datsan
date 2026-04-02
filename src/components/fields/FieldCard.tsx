import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Field } from '../../types';

interface FieldCardProps {
  field: Field;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field }) => {
  return (
    <div className="group bg-surface-container-lowest rounded-xl overflow-hidden stadium-shadow transition-all duration-500">
      <div className="relative h-64 overflow-hidden">
        <img src={field.image} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold text-sm">
          <Star className="w-3 h-3 text-orange-500 fill-current" /> {field.rating}
        </div>
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          <div className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {field.type}
          </div>
          <div className="bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {field.area}
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-headline text-xl font-bold">{field.name}</h3>
            <p className="text-on-surface-variant text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {field.location}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-primary">£{field.price}</span>
            <span className="text-xs text-on-surface-variant block uppercase font-bold tracking-tighter">per hour</span>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-surface-container-low">
          {field.amenities.map(a => (
            <span key={a} className="flex items-center gap-1 text-xs font-medium text-on-surface-variant">
              {a}
            </span>
          ))}
        </div>
        <Link to={`/booking/${field.id}`}>
          <Button className="w-full">Book Now</Button>
        </Link>
      </div>
    </div>
  );
};
