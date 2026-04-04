import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-surface p-6">
      <div className="mb-8 text-center">
        <Link to="/" className="text-3xl font-black text-primary italic tracking-tight font-headline">
          The Pitch Editorial
        </Link>
      </div>
      <LoginForm />
      <div className="mt-8 text-center">
        <Link to="/register" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
          Don't have an account? <span className="text-primary">Join the club</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;
