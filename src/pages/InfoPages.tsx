import React from 'react';
import { Shield, FileText, Trophy, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const PageHeader: React.FC<{ title: string; subtitle: string; icon: React.FC<any> }> = ({ title, subtitle, icon: Icon }) => (
  <div className="bg-surface-container-low border-b border-outline-variant/10 py-16 px-8 md:px-16 text-center">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto flex flex-col items-center">
      <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight mb-4">{title}</h1>
      <p className="text-on-surface-variant font-medium text-lg">{subtitle}</p>
    </motion.div>
  </div>
);

const ContentBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-4xl mx-auto px-8 py-16 prose prose-lg prose-headings:font-headline prose-headings:font-black prose-a:text-primary">
    {children}
  </div>
);

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeader title="Privacy Policy" subtitle="Your data security is our top priority." icon={Shield} />
      <ContentBlock>
        <h2>1. Information We Collect</h2>
        <p>At The Pitch Editorial, we collect personal information you provide to us when you register, book a field, or contact support. This includes your name, email, phone number, and payment information.</p>
        
        <h2>2. How We Use Your Data</h2>
        <p>We use your data to facilitate pitch bookings, manage your account, process transactions securely, and send you important updates regarding your scheduled matches or our services.</p>
        
        <h2>3. Data Protection</h2>
        <p>All sensitive data is encrypted using industry-standard protocols. We do not sell your personal information to third parties.</p>
      </ContentBlock>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeader title="Terms of Service" subtitle="The rules of the game." icon={FileText} />
      <ContentBlock>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using The Pitch Editorial booking platform, you agree to be bound by these Terms of Service. If you do not agree to all the terms, please do not use our services.</p>
        
        <h2>2. Booking and Cancellation</h2>
        <p>All bookings are subject to availability. Cancellations must be made at least 24 hours in advance to be eligible for a full refund. Late cancellations may incur a penalty fee.</p>
        
        <h2>3. Code of Conduct</h2>
        <p>Users must respect the facilities and other players. Any damage to the pitches or inappropriate behavior may result in a permanent ban from our platform.</p>
      </ContentBlock>
    </div>
  );
};

export const Hospitality: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeader title="Stadium Hospitality" subtitle="Premium experiences for corporate and VIP events." icon={Trophy} />
      <ContentBlock>
        <h2>The Ultimate Matchday Experience</h2>
        <p>Elevate your game with our exclusive Stadium Hospitality packages. Whether you're hosting clients, celebrating a special occasion, or just wanting to play in style, we have the perfect setup for you.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li><strong>VIP Pitch Access:</strong> Priority booking for our premium full-sized arenas.</li>
          <li><strong>Locker Room Experience:</strong> Fully stocked professional dressing rooms with customized kits.</li>
          <li><strong>Catering:</strong> Post-match gourmet food and beverages delivered straight to your private suite.</li>
          <li><strong>Match Recording:</strong> High-definition multi-angle recording of your game with professional commentary options.</li>
        </ul>
        
        <p>To inquire about hospitality packages, please use our contact page or reach out to our dedicated VIP team.</p>
      </ContentBlock>
    </div>
  );
};

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeader title="Contact Us" subtitle="We're here to help you get on the pitch." icon={Mail} />
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Customer Support</h3>
              <p className="text-on-surface-variant">Have questions about your booking? Our team is available 24/7.</p>
              <a href="mailto:support@datsan.vn" className="text-primary font-bold mt-2 inline-block hover:underline">support@datsan.vn</a>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Partnerships</h3>
              <p className="text-on-surface-variant">Are you a stadium owner looking to list your venue?</p>
              <a href="mailto:partners@datsan.vn" className="text-primary font-bold mt-2 inline-block hover:underline">partners@datsan.vn</a>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Headquarters</h3>
              <p className="text-on-surface-variant">123 Pitch Avenue, Football District<br />Hanoi, Vietnam</p>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
            <h3 className="text-2xl font-black font-headline mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <input type="text" placeholder="Your Name" className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 font-bold" />
              <input type="email" placeholder="Your Email" className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 font-bold" />
              <textarea placeholder="How can we help?" rows={4} className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 font-bold"></textarea>
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
