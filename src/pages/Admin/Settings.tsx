import React from 'react';
import { LayoutDashboard, Calendar, Map as Stadium, Users, Settings, HelpCircle, LogOut, Bell, Shield, CreditCard, Globe, Database } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/format';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';

const AdminSettings: React.FC = () => {
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="mb-12">
          <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Platform Settings</h2>
          <p className="text-on-surface-variant mt-2 font-medium">Configure global platform parameters, security, and integrations.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            {/* General Settings */}
            <section className="bg-white stadium-shadow rounded-2xl p-8">
              <h3 className="text-xl font-black font-headline mb-8 flex items-center gap-3">
                <Globe className="text-primary w-5 h-5" /> General Configuration
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Platform Name</label>
                    <input type="text" defaultValue="The Pitch Editorial" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Support Email</label>
                    <input type="email" defaultValue="support@pitch-editorial.com" className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Platform Description</label>
                  <textarea rows={3} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20" defaultValue="Premium football field booking platform for elite communities." />
                </div>
              </div>
            </section>

            {/* Security Settings */}
            <section className="bg-white stadium-shadow rounded-2xl p-8">
              <h3 className="text-xl font-black font-headline mb-8 flex items-center gap-3">
                <Shield className="text-primary w-5 h-5" /> Security & Access
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div>
                    <p className="font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-on-surface-variant">Require 2FA for all administrative accounts.</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div>
                    <p className="font-bold">New User Registration</p>
                    <p className="text-xs text-on-surface-variant">Allow new players to create accounts on the platform.</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl">
              <h4 className="text-2xl font-black font-headline mb-4">System Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Database</span>
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">API Gateway</span>
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Storage</span>
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Operational
                  </span>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-8 bg-white text-primary hover:bg-white/90">Run Diagnostics</Button>
            </div>

            <div className="bg-white stadium-shadow p-8 rounded-[2rem]">
              <h4 className="text-lg font-black font-headline mb-6">Integrations</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-xl cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Stripe Payments</p>
                    <p className="text-[10px] text-on-surface-variant">Connected</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-xl cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">AWS S3 Storage</p>
                    <p className="text-[10px] text-on-surface-variant">Connected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end gap-4">
          <Button variant="ghost">Discard Changes</Button>
          <Button className="px-12 py-4">Save Configuration</Button>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
