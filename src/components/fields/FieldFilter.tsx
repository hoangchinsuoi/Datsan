import React, { useState } from 'react';
import { Search, Star, MapPin, Layers, Users } from 'lucide-react';
import type { FieldFilters } from '../../hooks/useFields';

interface FieldFilterProps {
  filters: FieldFilters;
  onFilterChange: (filters: Partial<FieldFilters>) => void;
  fieldCount?: number;
}

const PITCH_FORMATS = [
  { key: 'FiveSide',    label: 'Sân 5',  players: '5 người' },
  { key: 'SevenSide',  label: 'Sân 7',  players: '7 người' },
  { key: 'ElevenSide', label: 'Sân 11', players: '11 người' },
] as const;

const POSITIONS = [
  { key: 'Front' as const, label: 'Sân tiền', desc: 'Mặt trước, dễ tiếp cận' },
  { key: 'Back'  as const, label: 'Sân sâu',  desc: 'Bên trong, yên tĩnh hơn' },
];

const AREAS = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng'];

export const FieldFilter: React.FC<FieldFilterProps> = ({ filters, onFilterChange, fieldCount }) => {
  const [priceValue, setPriceValue] = useState(filters.maxPrice ?? 2000000);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setPriceValue(val);
    onFilterChange({ maxPrice: val >= 2000000 ? undefined : val });
  };

  const togglePosition = (pos: 'Front' | 'Back') => {
    onFilterChange({ position: filters.position === pos ? undefined : pos });
  };

  const toggleFormat = (fmt: string) => {
    onFilterChange({ format: filters.format === fmt ? undefined : fmt });
  };

  const toggleArea = (area: string) => {
    onFilterChange({ location: filters.location === area ? undefined : area });
  };

  return (
    <aside className="w-full md:w-72 flex-shrink-0">
      <div className="sticky top-28 space-y-10">
        <h2 className="font-headline text-xl font-black flex items-center gap-3">
          <Search className="text-primary w-5 h-5" /> Bộ lọc
        </h2>

        {/* Loại sân: 5 / 7 / 11 */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
            <Users className="w-3.5 h-3.5" /> Loại sân
          </label>
          <div className="flex gap-3">
            {PITCH_FORMATS.map(({ key, label, players }) => {
              const active = filters.format === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFormat(key)}
                  className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 font-bold text-xs transition-all duration-200 ${
                    active
                      ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25'
                      : 'border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:border-primary/50 hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-lg font-black leading-tight">{label}</span>
                  <span className={`text-[9px] mt-1 font-bold uppercase tracking-widest ${active ? 'text-white/80' : 'text-on-surface-variant/60'}`}>
                    {players}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mức giá */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
            Mức giá tối đa
          </label>
          <div className="px-1">
            <input
              type="range"
              min={50000}
              max={2000000}
              step={50000}
              value={priceValue}
              onChange={handlePriceChange}
              className="w-full h-1 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-3 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
              <span>50k₫</span>
              <span className={priceValue >= 2000000 ? 'text-primary' : ''}>
                {priceValue >= 2000000 ? 'Tất cả' : `${priceValue.toLocaleString('vi-VN')}₫`}
              </span>
            </div>
          </div>
        </div>

        {/* Đặc điểm sân: Tiền / Sâu */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
            <Layers className="w-3.5 h-3.5" /> Đặc điểm sân
          </label>
          <div className="space-y-2">
            {POSITIONS.map((pos) => (
              <label
                key={pos.key}
                className={`flex items-start gap-4 cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 ${
                  filters.position === pos.key
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-transparent hover:border-outline-variant/30 hover:bg-surface-container-low'
                }`}
              >
                <div
                  onClick={(e) => { e.preventDefault(); togglePosition(pos.key); }}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${
                    filters.position === pos.key
                      ? 'bg-primary border-primary'
                      : 'border-outline-variant'
                  }`}
                >
                  {filters.position === pos.key && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div onClick={() => togglePosition(pos.key)} className="flex flex-col cursor-pointer">
                  <span className={`text-xs font-bold ${filters.position === pos.key ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {pos.label}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60 mt-0.5">{pos.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Khu vực */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
            <MapPin className="w-3.5 h-3.5" /> Khu vực
          </label>
          <div className="space-y-3">
            {AREAS.map((area) => {
              const active = filters.location === area;
              return (
                <label key={area} className="flex items-center gap-4 group cursor-pointer" onClick={() => toggleArea(area)}>
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    active ? 'bg-primary border-primary' : 'border-outline-variant group-hover:border-primary'
                  }`}>
                    {active && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs font-bold transition-colors ${active ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                    {area}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-full">
          <span className="text-xs font-bold flex items-center gap-2">
            4.5+ <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </span>
          <span className="text-[10px] text-on-surface-variant font-bold">{fieldCount ?? 0} sân</span>
        </div>
      </div>
    </aside>
  );
};
