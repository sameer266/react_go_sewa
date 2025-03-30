import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Bus, LogIn, LogOut, Menu, X, Phone, CircleUserRound } from 'lucide-react';
import { logout } from '../auth/authSlice';
import { LogoutApi, NavAndContactApi } from '../api/homeApi';
import Loader from './Loader';
import toast, { Toaster } from 'react-hot-toast';

export default function Navbar() {
  const [navdata, setNavdata] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const userType = role;
  const currentPath = location.pathname;

  const fetchData = async () => {
    const response = await NavAndContactApi();
    if (response?.success) {
      setNavdata(response.data);
    }
  };

  useEffect(() => {
    fetchData();
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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

  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const getDashboardPath = () => {
    if (userType === 'admin') return '/admin-dashboard';
    if (userType === 'customer') return '/user-dashboard';
    if (userType === 'sub_admin') return '/counter-dashboard';
  };

  const handleDashboard = () => {
    if (!isAuthenticated) return;
    navigate(getDashboardPath());
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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/schedule', label: 'Schedule' },
    { to: '/services', label: 'Services' },
    { to: '/all-routes', label: 'Routes' },
    { to: '/bus-reserve', label: 'Bus Reserve' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const renderNavLinks = () => (
    navLinks.map(({ to, label }) => (
      <Link
        key={to}
        to={to}
        className={`text-gray-800 hover:text-green-600 px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
          currentPath === to ? 'text-green-600 border-b-2 border-green-600' : ''
        }`}
      >
        {label}
      </Link>
    ))
  );

  return (
    <>
      {loading && <Loader />}
      <Toaster autoClose={3000} />

      <header className={`fixed w-full top-0 z-50 bg-white shadow-lg transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={`http://127.0.0.1:8000${navdata.image}`}
                alt="Go Sewa"
                className="h-16 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            {userType !== 'admin' && (
              <nav className="hidden md:flex space-x-2 items-center">
                {renderNavLinks()}
              </nav>
            )}

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to={`tel:+977${navdata.phone}`}
                className="flex items-center text-gray-800 hover:text-green-600 text-base font-medium"
              >
                <Phone className="h-5 w-5 mr-2 text-green-600" />
                <span>+977-{navdata.phone}</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <span
                    className="flex items-center text-gray-800 hover:text-green-600 cursor-pointer text-base font-medium"
                    onClick={handleDashboard}
                  >
                    <CircleUserRound className="h-5 w-5 mr-2 text-green-600" />
                    {user || 'Loading...'}
                  </span>
                  <button
                    className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 text-base font-medium transition-all shadow-md"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/sign-in"
                  className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 text-base font-medium transition-all shadow-md"
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
              {isMobileMenuOpen ? <X className="h-6 w-6 text-green-600" /> : <Menu className="h-6 w-6 text-green-600" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div ref={menuRef} className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-green-100">
              <nav className="flex flex-col items-center p-4 space-y-4">
                {userType !== 'admin' && (
                  <>
                    {navLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`w-full text-center text-gray-800 hover:text-green-600 py-2 text-base font-medium transition-colors duration-200 ${
                          currentPath === to ? 'text-green-600 border-b-2 border-green-600' : ''
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                    <Link
                      to={`tel:+977${navdata.phone}`}
                      className="flex justify-center items-center w-full text-gray-800 hover:text-green-600 py-2 text-base font-medium"
                    >
                      <Phone className="h-5 w-5 mr-2 text-green-600" />
                      <span>+977-{navdata.phone}</span>
                    </Link>
                  </>
                )}
                {isAuthenticated ? (
                  <>
                    <span
                      className="flex justify-center items-center w-full text-gray-800 hover:text-green-600 py-2 text-base font-medium cursor-pointer"
                      onClick={handleDashboard}
                    >
                      <CircleUserRound className="h-5 w-5 mr-2 text-green-600" />
                      {user || 'Loading...'}
                    </span>
                    <button
                      className="flex justify-center items-center w-full max-w-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 text-base font-medium transition-all shadow-md"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/sign-in"
                    className="flex justify-center items-center w-full max-w-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 text-base font-medium transition-all shadow-md"
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