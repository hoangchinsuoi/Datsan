import React from 'react';
import { Button } from '../common/Button';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-[2rem] stadium-shadow">
      <div className="text-center">
        <h2 className="text-3xl font-black font-headline tracking-tight">Welcome Back</h2>
        <p className="text-on-surface-variant text-sm mt-2">Sign in to manage your bookings and team.</p>
      </div>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input type="email" placeholder="name@example.com" className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
            <Link to="/forgot-password" title="Recover Password" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input type="password" placeholder="••••••••" className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        
        <Button className="w-full py-4 text-lg group">
          Sign In <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
      
      <p className="text-center text-sm text-on-surface-variant">
        Don't have an account? <button className="text-primary font-bold hover:underline">Join the club</button>
      </p>
    </div>
  );
};
