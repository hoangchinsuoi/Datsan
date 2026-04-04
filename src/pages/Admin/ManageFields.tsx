import React from 'react';
import { LayoutDashboard, Calendar, Map as Stadium, Users, Settings, PlusCircle, HelpCircle, LogOut, Search, Filter, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/format';
import { MOCK_FIELDS } from '../../services/api';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { NewFieldModal } from '../../components/NewFieldModal';

const AdminFields: React.FC = () => {
  const [isNewFieldOpen, setIsNewFieldOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AdminSidebar onNewFieldClick={() => setIsNewFieldOpen(true)} />
      <NewFieldModal isOpen={isNewFieldOpen} onClose={() => setIsNewFieldOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black font-headline tracking-tight text-on-surface">Field Inventory</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Manage your pitches, pricing, and availability.</p>
          </div>
          <Button onClick={() => setIsNewFieldOpen(true)} className="flex items-center gap-2 shadow-xl shadow-primary/20">
            <PlusCircle className="w-5 h-5" /> Add New Pitch
          </Button>
        </header>

        {/* Filters & Search */}
        <div className="bg-white stadium-shadow rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input 
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-sm font-medium" 
              placeholder="Search by name, location or type..." 
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select className="bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold appearance-none">
              <option>All Types</option>
              <option>5-a-side</option>
              <option>7-a-side</option>
              <option>11-a-side</option>
            </select>
            <select className="bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold appearance-none">
              <option>All Areas</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
              <option>Central</option>
            </select>
            <Button variant="ghost" className="bg-surface-container-low">
              <Filter className="w-5 h-5 mr-2" /> More Filters
            </Button>
          </div>
        </div>

        {/* Fields List */}
        <div className="grid grid-cols-1 gap-6">
          {MOCK_FIELDS.map((field) => (
            <div key={field.id} className="bg-white stadium-shadow rounded-2xl overflow-hidden flex flex-col md:flex-row group">
              <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden">
                <img src={field.image} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                    {field.type}
                  </div>
                  <div className="bg-secondary text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                    {field.area}
                  </div>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black font-headline mb-1">{field.name}</h3>
                    <p className="text-on-surface-variant text-sm flex items-center gap-1">
                      {field.location} • {field.rating} ★ ({field.reviewsCount} reviews)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black font-headline text-primary">${field.price}</p>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Per Hour</p>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-surface-container pt-6">
                  <div className="flex gap-2">
                    {field.amenities.slice(0, 3).map(a => (
                      <span key={a} className="text-[10px] font-bold bg-surface-container-high px-2 py-1 rounded-full uppercase tracking-tighter">
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="bg-surface-container-low hover:bg-primary/10 hover:text-primary">
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-surface-container-low hover:bg-secondary/10 hover:text-secondary">
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-surface-container-low hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminFields;
