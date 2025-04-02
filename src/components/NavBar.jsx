import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Bus, LogIn, LogOut, Menu, X, Phone, CircleUserRound } from 'lucide-react';
import { logout } from '../auth/authSlice';
import { LogoutApi, NavAndContactApi } from '../api/homeApi';
import Loader from './Loader';
import toast, { Toaster } from 'react-hot-toast';

export default function Navbar() {
  // State management
  const [navdata, setNavdata] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const currentPath = location.pathname;

  // Navigation links
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/schedule', label: 'Schedule' },
    { to: '/services', label: 'Services' },
    { to: '/all-routes', label: 'Routes' },
    { to: '/bus-reserve', label: 'Bus Reserve' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  // Fetch navigation data
  const fetchData = async () => {
    try {
      const response = await NavAndContactApi();
      if (response?.success) {
        setNavdata(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch navbar data:', error);
    }
  };

  // Scroll handler
  useEffect(() => {
    fetchData();
    
    // Handle scroll with debounce
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    let debounceTimer;
    const onScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleScroll, 100);
    };
    
    window.addEventListener('scroll', onScroll);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(debounceTimer);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper functions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'customer') return '/user-dashboard';
    if (role === 'sub_admin') return '/counter-dashboard';
    return '/';
  };

  const handleDashboard = () => {
    if (isAuthenticated) {
      navigate(getDashboardPath());
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await LogoutApi();
      
      if (response?.success) {
        localStorage.clear();
        navigate('/');
        
        setTimeout(() => {
          dispatch(logout());
          toast.success('Logout successful');
        }, 1000);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine if nav links should be shown based on user role
  const shouldShowNavLinks = role !== 'admin' && role !== 'sub_admin';

  // Nav link component
  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      className={`text-gray-800 hover:text-green-600 py-2 text-base font-medium transition-colors duration-200 ${
        currentPath === to ? 'text-green-600 border-b-2 border-green-600' : ''
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {loading && <Loader />}
      <Toaster position="top-center" />

      <header className={`fixed w-full top-0 z-50 bg-white shadow-lg transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={navdata.image ? `http://127.0.0.1:8000${navdata.image}` : ''}
                alt="Go Sewa"
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {shouldShowNavLinks && (
                <div className="flex space-x-6">
                  {navLinks.map((link) => (
                    <NavLink key={link.to} to={link.to} label={link.label} />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {navdata.phone && (
                <Link
                  to={`tel:+977${navdata.phone}`}
                  className="flex items-center text-gray-800 hover:text-green-600 text-base font-medium"
                >
                  <Phone className="h-5 w-5 mr-2 text-green-600" />
                  <span>+977-{navdata.phone}</span>
                </Link>
              )}

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button
                    className="flex items-center text-gray-800 hover:text-green-600 text-base font-medium"
                    onClick={handleDashboard}
                  >
                    <CircleUserRound className="h-5 w-5 mr-2 text-green-600" />
                    {user || 'User'}
                  </button>
                  
                  <button
                    className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 text-base font-medium transition-all shadow-md"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/sign-in"
                  className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 text-base font-medium transition-all shadow-md"
                >
                  <LogIn className="h-5 w-5 mr-2" /> Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-md text-gray-800 hover:bg-gray-100"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? 
                <X className="h-6 w-6 text-green-600" /> : 
                <Menu className="h-6 w-6 text-green-600" />
              }
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div 
              ref={menuRef} 
              className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-3 px-4"
            >
              <nav className="flex flex-col space-y-3">
                {shouldShowNavLinks && (
                  <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`block w-full text-gray-800 hover:text-green-600 py-2 text-base font-medium transition-colors duration-200 ${
                          currentPath === link.to ? 'text-green-600 border-b border-green-600' : ''
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}
                
                {navdata.phone && (
                  <Link
                    to={`tel:+977${navdata.phone}`}
                    className="flex items-center text-gray-800 hover:text-green-600 py-2 text-base font-medium"
                  >
                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                    <span>+977-{navdata.phone}</span>
                  </Link>
                )}

                {isAuthenticated ? (
                  <div className="flex flex-col space-y-3 pt-2">
                    <button
                      className="flex items-center text-gray-800 hover:text-green-600 py-2 text-base font-medium"
                      onClick={handleDashboard}
                    >
                      <CircleUserRound className="h-5 w-5 mr-2 text-green-600" />
                      {user || 'User'}
                    </button>
                    
                    <button
                      className="flex justify-center items-center w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 text-base font-medium transition-all shadow-md"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/sign-in"
                    className="flex justify-center items-center w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 text-base font-medium transition-all shadow-md mt-2"
                  >
                    <LogIn className="h-5 w-5 mr-2" /> Sign In
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}