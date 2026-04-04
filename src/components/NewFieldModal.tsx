import React from 'react';
import { Button } from './common/Button';
import { X, Plus, Image as ImageIcon, MapPin, DollarSign, Info, Shield, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/format';

interface NewFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewFieldModal: React.FC<NewFieldModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = React.useState(1);

  const steps = [
    { id: 1, name: 'Basic Info', icon: Info },
    { id: 2, name: 'Pricing & Location', icon: DollarSign },
    { id: 3, name: 'Amenities', icon: Shield },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto"
          >
            {/* Sidebar */}
            <div className="w-full md:w-80 bg-[#121417] p-10 text-white flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-[#146312] rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-green-900/40">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black font-headline tracking-tight leading-none mb-4">Add New Pitch</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed mb-12">Expand your inventory and reach more players across the city.</p>
                
                <div className="space-y-6">
                  {steps.map((s) => (
                    <div key={s.id} className={cn(
                      "flex items-center gap-4 transition-all duration-500",
                      step === s.id ? "opacity-100 translate-x-2" : "opacity-30"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        step === s.id ? "bg-[#146312] text-white" : "bg-white/10 text-white"
                      )}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                  <Zap className="w-4 h-4 text-[#146312]" /> 
                  <span>Instant Deployment</span>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-12 bg-white overflow-y-auto">
              <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-surface-container-low rounded-full transition-colors z-10">
                <X className="w-6 h-6" />
              </button>

              <div className="max-w-xl mx-auto space-y-10">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Pitch Name</label>
                      <input type="text" placeholder="e.g. The Emerald Arena" className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Field Type</label>
                        <select className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold appearance-none">
                          <option>Natural Grass</option>
                          <option>Hybrid Turf</option>
                          <option>Artificial Astro</option>
                          <option>Indoor Futsal</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Size</label>
                        <select className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold appearance-none">
                          <option>5-a-side</option>
                          <option>7-a-side</option>
                          <option>11-a-side</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Description</label>
                      <textarea rows={4} placeholder="Describe the pitch quality, atmosphere, and unique features..." className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Pitch Image</label>
                      <div className="w-full h-48 border-2 border-dashed border-surface-container-highest rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-surface-container-high rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-6 h-6 text-on-surface-variant" />
                        </div>
                        <p className="text-sm font-bold text-on-surface-variant">Click to upload or drag and drop</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Price per Hour</label>
                        <div className="relative">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                          <input type="number" placeholder="85" className="w-full bg-surface-container-low border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Area</label>
                        <select className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold appearance-none">
                          <option>Central</option>
                          <option>North</option>
                          <option>South</option>
                          <option>East</option>
                          <option>West</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Full Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                        <input type="text" placeholder="123 Stadium Way, London" className="w-full bg-surface-container-low border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Lighting Quality</label>
                      <select className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 font-bold appearance-none">
                        <option>Pro LED (Broadcast Grade)</option>
                        <option>Standard Floodlights</option>
                        <option>None (Daylight Only)</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Amenities</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Floodlights', 'Showers', 'Parking', 'Cafe', 'WiFi', 'Locker Rooms', 'Water Station', 'First Aid'].map((amenity) => (
                          <label key={amenity} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl cursor-pointer hover:bg-surface-container-high transition-colors group">
                            <input type="checkbox" className="w-6 h-6 rounded-lg border-none bg-white text-primary focus:ring-primary/20" />
                            <span className="text-sm font-bold">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest text-primary">Pitch Verification</p>
                          <p className="text-xs text-on-surface-variant mt-1">New pitches are automatically flagged for quality verification by our editorial team before going live.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4 pt-8">
                  {step > 1 && (
                    <Button variant="ghost" onClick={() => setStep(step - 1)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Back</Button>
                  )}
                  <Button onClick={() => step < 3 ? setStep(step + 1) : onClose()} className="flex-[2] py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                    {step === 3 ? 'Deploy Pitch' : 'Next Step'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
