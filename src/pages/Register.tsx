import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-surface p-6">
      <div className="mb-8 text-center">
        <Link to="/" className="text-3xl font-black text-primary italic tracking-tight font-headline">
          The Pitch Editorial
        </Link>
      </div>
      <RegisterForm />
      <div className="mt-8 text-center">
        <Link to="/login" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
          Already a member? <span className="text-primary">Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
