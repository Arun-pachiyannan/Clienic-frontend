import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/appointment", label: "Appointment" },
  { to: "/track-order", label: "Track Order" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-brand" : "text-ink/70 hover:text-brand"}`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Cart, ${totalItems} items`}
          >
            <svg className="h-6 w-6 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M17 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM7 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-white text-[11px] font-semibold flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-brand hover:text-brand-dark">
                  Admin
                </Link>
              )}
              <Link
                to="/account"
                className="text-sm font-medium text-ink/80 hover:text-brand px-2"
              >
                {user?.name?.split(" ")[0] || "Account"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-600 px-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink/80 hover:text-brand px-3 py-2">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/cart" className="relative p-2" aria-label={`Cart, ${totalItems} items`}>
            <svg className="h-6 w-6 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M17 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM7 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-white text-[11px] font-semibold flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="h-6 w-6 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-brand">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/account" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink/80">
                  My Account
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-left text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink/80">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
