import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Trophy } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../utils/format';

import { FieldCard } from '../components/fields/FieldCard';
import { SearchHero } from '../components/fields/SearchHero';
import { useFields } from '../hooks/useFields';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { fields, loading } = useFields();
  const featured = fields.slice(0, 3);

  const handleCategoryClick = (type: string) => {
    const searchType = type === 'Full Pitch' ? '11-a-side' : type.toLowerCase();
    navigate(`/search?type=${searchType}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center justify-center px-8 md:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1920" 
            alt="Stadium" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 px-6 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">The Ultimate Pitch Finder</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black font-headline text-white leading-[0.85] tracking-tighter mb-12 italic drop-shadow-2xl"
          >
            CLAIM YOUR <br/><span className="text-primary drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]">TERRITORY</span>
          </motion.h1>
          
          <SearchHero />
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
              onClick={() => handleCategoryClick(cat.title)}
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
          {loading && (
            <p className="text-on-surface-variant font-bold col-span-full">Đang tải sân từ máy chủ…</p>
          )}
          {!loading &&
            featured.map((field, i) => (
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
