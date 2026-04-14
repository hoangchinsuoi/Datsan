import React from "react";
import { User, Lock, Edit2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useAuth } from "../../hooks/useAuth";

const AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const u = user ?? { name: "", email: "", phone: "", avatar: AVATAR_FALLBACK };
  return (
    <div className="space-y-12">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface">Settings</h1>
        </div>
        <p className="text-on-surface-variant text-xl max-w-2xl leading-relaxed">
          Manage your personal profile, match preferences, and account security to ensure the best experience on the pitch.
        </p>
      </header>

      <div className="space-y-16">
        <section className="bg-white rounded-[3rem] p-10 md:p-12 stadium-shadow relative overflow-hidden border border-outline-variant/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <h3 className="text-2xl font-black font-headline flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="text-primary w-6 h-6" />
              </div>
              Personal Profile
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full">
              Member since June 2023
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-3 flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-surface-container-low stadium-shadow group-hover:scale-[1.02] transition-transform duration-500">
                  <img src={u.avatar ?? AVATAR_FALLBACK} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-primary text-white p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Photo Requirements</p>
                <p className="text-[10px] text-on-surface-variant/60 leading-tight">JPG, PNG or GIF.<br/>Max 5MB.</p>
              </div>
            </div>

            <div className="lg:col-span-9 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="Full Name" defaultValue={u.name} />
                <Input label="Email Address" type="email" defaultValue={u.email} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="Phone Number" type="tel" defaultValue={u.phone ?? ""} />
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">Preferred Position</label>
                  <div className="relative">
                    <select className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none">
                      <option>Forward</option>
                      <option>Midfielder</option>
                      <option>Defender</option>
                      <option>Goalkeeper</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ArrowRight className="w-4 h-4 rotate-90 text-on-surface-variant" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] p-10 md:p-12 stadium-shadow border border-outline-variant/5">
          <h3 className="text-2xl font-black font-headline flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Lock className="text-secondary w-6 h-6" />
            </div>
            Security & Access
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-lg font-black font-headline">Change Password</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Update your password regularly to keep your account and booking history secure. We recommend using a strong, unique password.
              </p>
              <div className="pt-4">
                <div className="flex items-center gap-3 text-xs font-bold text-secondary">
                  <ShieldCheck className="w-4 h-4" /> Two-Factor Auth Enabled
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <Input 
                label="Current Password"
                type="password" 
                placeholder="••••••••••••" 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input 
                  label="New Password"
                  type="password" 
                />
                <Input 
                  label="Confirm New Password"
                  type="password" 
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8">
          <Button variant="ghost" className="px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest">Discard Changes</Button>
          <Button className="px-16 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/20">Save Account Changes</Button>
        </div>
      </div>
    </div>
  );
};
