import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-low w-full py-12 px-8 md:px-16 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="font-headline font-black text-on-surface text-xl">The Pitch Editorial</span>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">
            © 2024 The Pitch Editorial. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-xs uppercase tracking-widest font-medium">
          <Link to="#" className="text-on-surface-variant hover:text-primary underline decoration-secondary decoration-2 underline-offset-4">Privacy</Link>
          <Link to="#" className="text-on-surface-variant hover:text-primary">Terms</Link>
          <Link to="#" className="text-on-surface-variant hover:text-primary">Stadium Hospitality</Link>
          <Link to="#" className="text-on-surface-variant hover:text-primary">Contact</Link>
        </div>
      </div>
    </footer>
  );
};
