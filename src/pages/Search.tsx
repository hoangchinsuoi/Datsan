import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FieldCard } from "../components/fields/FieldCard";
import { FieldFilter } from "../components/fields/FieldFilter";
import { FieldSearch } from "../components/fields/FieldSearch";
import { useFields } from "../hooks/useFields";

const SearchPage: React.FC = () => {
  const { fields, loading, error } = useFields();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <FieldFilter />

        <div className="flex-1 flex flex-col h-full">
          <FieldSearch count={fields.length} viewMode={viewMode} onViewModeChange={setViewMode} />
          {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
          {loading && <p className="text-on-surface-variant font-bold">Đang tải…</p>}
          {!loading && (
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {fields.map((field) => (
                    <FieldCard key={field.id} field={field} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col lg:flex-row gap-6 h-[700px]"
                >
                  <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {fields.map((field) => (
                      <div 
                        key={field.id} 
                        className="transform transition-transform duration-200"
                        onMouseEnter={() => setHoveredFieldId(field.id)}
                        onMouseLeave={() => setHoveredFieldId(null)}
                        style={{ scale: hoveredFieldId === field.id ? 1.02 : 1 }}
                      >
                        <FieldCard field={field} />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 rounded-3xl overflow-hidden bg-surface-container-low border-2 border-outline-variant/20 relative">
                    <iframe
                      title="Bản đồ tổng quan các sân"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        hoveredFieldId 
                          ? (fields.find(f => f.id === hoveredFieldId)?.location || 'Hà Nội')
                          : 'Sân bóng đá Hà Nội'
                      )}&output=embed`}
                    ></iframe>
                    {!hoveredFieldId && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold shadow-lg text-primary pointer-events-none">
                        Rê chuột vào một sân để xem vị trí!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
