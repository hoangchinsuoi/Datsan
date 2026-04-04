import React from 'react';
import { Button } from '../common/Button';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-[2rem] stadium-shadow">
      <div className="text-center">
        <h2 className="text-3xl font-black font-headline tracking-tight">Join the Elite</h2>
        <p className="text-on-surface-variant text-sm mt-2">Create your player profile and start booking.</p>
      </div>
      
      <form className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input type="text" placeholder="Julian Alvarez" className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input type="email" placeholder="name@example.com" className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input type="tel" placeholder="+44 20 7123 4567" className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input type="password" placeholder="••••••••" className="w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        
        <Button className="w-full py-4 text-lg group mt-4">
          Create Profile <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
      
      <p className="text-center text-sm text-on-surface-variant">
        Already a member? <button className="text-primary font-bold hover:underline">Sign in</button>
      </p>
    </div>
  );
};
