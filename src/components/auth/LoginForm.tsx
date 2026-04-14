import React, { useState } from "react";
import { Button } from "../common/Button";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-[2rem] stadium-shadow">
      <div className="text-center">
        <h2 className="text-3xl font-black font-headline tracking-tight">Welcome Back</h2>
        <p className="text-on-surface-variant text-sm mt-2">Sign in to manage your bookings and team.</p>
      </div>

      {error && (
        <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">
            Email hoặc tên đăng nhập
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com hoặc admin"
              className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
            <Link to="/forgot-password" title="Recover Password" className="text-xs font-bold text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full py-4 text-lg group">
          {submitting ? "Signing in…" : "Sign In"} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-primary font-bold hover:underline">
          Join the club
        </Link>
      </p>
    </div>
  );
};
