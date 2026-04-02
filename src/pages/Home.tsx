import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Trophy } from 'lucide-react';
import { Button } from '../components/common/Button';
import { MOCK_FIELDS } from '../services/api';
import { Link } from 'react-router-dom';
import { cn } from '../utils/format';

import { FieldCard } from '../components/fields/FieldCard';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center px-8 md:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1920" 
            alt="Stadium" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black font-headline text-on-surface leading-[0.9] tracking-tighter mb-8 italic"
          >
            CLAIM YOUR <br/><span className="text-primary">TERRITORY</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-container-lowest p-4 md:p-6 rounded-[2rem] stadium-shadow flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 px-4 border-r-0 md:border-r border-outline-variant/20">
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Location</span>
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary w-4 h-4" />
                  <input type="text" placeholder="London, UK" className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold w-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1 px-4 border-r-0 md:border-r border-outline-variant/20">
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Date</span>
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary w-4 h-4" />
                  <input type="text" placeholder="Select Date" className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold w-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1 px-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Pitch Type</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">sports_soccer</span>
                  <select className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold w-full appearance-none cursor-pointer">
                    <option>5-a-side</option>
                    <option>7-a-side</option>
                    <option>11-a-side</option>
                  </select>
                </div>
              </div>
            </div>
            <Button className="w-full md:w-auto px-10 py-4 rounded-2xl">SEARCH</Button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-8 md:px-16 bg-surface">
        <div className="mb-12">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Categories</span>
          <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface">CHOOSE YOUR FORMAT</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '5-a-Side', desc: 'High intensity, rapid transitions. Perfect for fast-paced skill expression.', color: 'bg-primary' },
            { title: '7-a-Side', desc: 'The tactical sweet spot. Balance between endurance and technical play.', color: 'bg-secondary' },
            { title: 'Full Pitch', desc: 'The ultimate arena. Professional dimensions for the complete football experience.', color: 'bg-on-surface' }
          ].map((cat) => (
            <motion.div 
              key={cat.title}
              whileHover={{ y: -8 }}
              className="group bg-surface-container-low p-8 rounded-[2rem] transition-all cursor-pointer hover:bg-primary-container hover:text-white"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", cat.color)}>
                <Trophy className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black font-headline mb-2">{cat.title}</h3>
              <p className="text-on-surface-variant group-hover:text-white/80">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Arenas */}
      <section className="py-24 px-8 md:px-16">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">FEATURED ARENAS</h2>
          <Link to="/search" className="text-primary font-bold flex items-center gap-2 group">
            View all fields 
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {MOCK_FIELDS.slice(0, 3).map((field, i) => (
            <motion.div 
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(i === 1 && "lg:mt-12", i === 2 && "lg:mt-24")}
            >
              <FieldCard field={field} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Elevate Section */}
      <section className="py-32 bg-on-surface text-surface overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
        <div className="px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1526232762682-d2f5f717d33b?auto=format&fit=crop&q=80&w=800" 
              alt="Players" 
              className="rounded-[3rem] w-full aspect-square object-cover"
            />
            <div className="absolute -bottom-10 -right-10 bg-secondary p-12 rounded-[2.5rem] hidden lg:block stadium-shadow">
              <span className="text-5xl font-black font-headline italic">100k+</span>
              <p className="font-bold uppercase tracking-widest text-xs opacity-80 mt-2">Active Players</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-12 relative z-10">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">The Advantage</span>
              <h2 className="text-5xl md:text-6xl font-black font-headline tracking-tighter leading-tight mb-8">ELEVATE YOUR <br/>GAME DAY</h2>
              <p className="text-surface/80 text-lg leading-relaxed max-w-lg">We provide access to the finest football facilities with a booking experience as smooth as a clinical finish.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Instant Booking', desc: 'No more back-and-forth calls. See live availability and secure your slot in seconds.' },
                { title: 'Vetted Quality', desc: 'Every pitch on our platform meets strict professional standards for turf and amenities.' },
                { title: 'Split Payments', desc: 'Easily split the booking cost among your teammates directly within the app.' },
                { title: 'Elite Rewards', desc: 'Earn points for every match played and unlock exclusive discounts at local stadiums.' }
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-4">
                  <h4 className="text-xl font-black font-headline">{item.title}</h4>
                  <p className="text-surface/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
