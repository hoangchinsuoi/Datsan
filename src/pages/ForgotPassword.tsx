import React from 'react';
import { Button } from '../components/common/Button';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-surface p-6">
      <div className="mb-8 text-center">
        <Link to="/" className="text-3xl font-black text-primary italic tracking-tight font-headline">
          The Pitch Editorial
        </Link>
      </div>
      
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-[2rem] stadium-shadow">
        <div className="text-center">
          <h2 className="text-3xl font-black font-headline tracking-tight">Recover Password</h2>
          <p className="text-on-surface-variant text-sm mt-2">Enter your email and we'll send you instructions to reset your password.</p>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input type="email" placeholder="name@example.com" className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          
          <Button className="w-full py-4 text-lg group">
            Send Reset Link <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
        
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-primary hover:underline">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
