import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, BookOpen, LogIn } from 'lucide-react';

const Header = () => {
  const { logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isPostsPath = location.pathname === '/posts';
  const isHomePath = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border-subtle">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
              <BookOpen size={22} />
            </div>
            <span>Nexus <span className="text-primary">Blog</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-sm font-medium transition-colors ${isHomePath ? 'text-primary' : 'text-slate-400 hover:text-white'}`}>Home</Link>
            <Link to="/posts" className={`text-sm font-medium transition-colors ${isPostsPath ? 'text-primary' : 'text-slate-400 hover:text-white'}`}>Posts</Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" className={`text-sm font-medium transition-colors ${isAdminPath ? 'text-primary' : 'text-slate-400 hover:text-white'}`}>Dashboard</Link>
                <div className="flex items-center gap-4 pl-4 border-l border-border-subtle">
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                <LogIn size={16} />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-400">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64 border-b border-border-subtle bg-bg-card' : 'max-h-0'}`}>
        <div className="px-4 py-6 space-y-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 ${isHomePath ? 'text-primary' : 'text-slate-300 hover:text-white'}`}>Home</Link>
          <Link to="/posts" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 ${isPostsPath ? 'text-primary' : 'text-slate-300 hover:text-white'}`}>Posts</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:text-white">Dashboard</Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 text-red-400 px-3 py-2 text-sm font-medium hover:bg-red-400/5 rounded-xl transition-colors">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:text-white">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
