import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Calendar, History, Menu } from "lucide-react";
import { Button } from "../common/Button";
import { cn } from "../../utils/format";
import { useAuth } from "../../hooks/useAuth";

const AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: "Fields", path: "/search", icon: Search },
    { name: "Calendar", path: "/booking", icon: Calendar },
    { name: "History", path: "/bookings", icon: History },
  ];

  const isAdmin = user?.role === "admin";

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav h-20 flex justify-between items-center px-8 stadium-shadow">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-black text-primary italic tracking-tight font-headline">
          The Pitch Editorial
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "font-headline font-bold tracking-tight transition-colors relative",
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.name}
                {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "font-headline font-bold tracking-tight transition-colors relative text-secondary hover:text-secondary/80",
                location.pathname.startsWith("/admin") && "text-secondary"
              )}
            >
              Admin Suite
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full gap-2">
          <Search className="text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            placeholder="Search fields..."
            className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface"
          />
        </div>

        <div className="hidden md:flex items-center gap-4 mr-2">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm">
                  Join Now
                </Button>
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => logout()}
              className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>

        <Link to="/search">
          <Button variant="secondary" size="md">
            Book Now
          </Button>
        </Link>

        <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 bg-surface-container-low">
          <img src={user?.avatar ?? AVATAR_FALLBACK} alt="Profile" className="w-full h-full object-cover" />
        </Link>

        <button type="button" className="md:hidden p-2 text-on-surface" aria-label="Menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};
