import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Bus, LogIn, Book, Menu, X, Phone, CircleUserRound, LogOut } from 'lucide-react'; 
import logout from '../auth/authSlice'
import '../style/home/componentCss/navbar.css';

import { LogoutApi } from '../api/homeApi';
import toast,{ Toaster } from 'react-hot-toast';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate= useNavigate()
  const currentPath = location.pathname;
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated)
  const user = useSelector((state) => state.auth.user);


  // Handle scrolling effect
  useEffect(() => {
    let debounceTimer;
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
  
    const onScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleScroll, 100);
    };
  
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await LogoutApi();
      dispatch(logout());
      localStorage.clear();
      
      toast.success('Logout successful');
  
      setTimeout(() => {
        navigate('/');
      }, 1000); // Wait 1 second before navigating
  
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error('Logout failed. Please try again.');
    }
  };
  
  

  return (
    <>
    <Toaster autoClose={3000}/>
    
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="logo">
          <Bus className="logo-icon" />
          <span className="logo-text">Go Sewa</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="desktop-nav">
          <Link to="/" className={`nav-link ${currentPath === '/' ? "active" : ""}`}>Home</Link>
          <Link to="/routes" className={`nav-link ${currentPath === '/routes' ? "active" : ""}`}>Routes</Link>
          <Link to="/services" className={`nav-link ${currentPath === '/services' ? "active" : ""}`}>Services</Link>
          <Link to="/about" className={`nav-link ${currentPath === "/about" ? "active" : ""}`}>About</Link>
          <Link to="/contact" className={`nav-link ${currentPath === '/contact' ? "active" : ""}`}>Contact</Link>
        </nav>

        {/* Action Buttons (Desktop) */}
        <div className="desktop-actions">
          {/* Phone Number */}
          <Link to="tel:+9779841000000" className="phone-number">
            <Phone className="phone-icon" />
            <span>+977 9841 000000</span>
          </Link>

          {isAuthenticated ? (
            <>
              <span className="user-info">
                <CircleUserRound className="icon" /> {user || 'Loading...'}
              </span>
              <button className="logout-button" onClick={handleLogout}>
                <LogOut className="icon" /> Logout
              </button>
            </>
          ) : (
            <Link to="/sign-in" className="sign-in">
              <LogIn className="icon" /> Sign In
            </Link>
          )}

          <button className="book-now">
            <Book className="icon" /> Book Now
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        {isMobileMenuOpen && (
          <nav className="mobile-nav">
            <Link to="/" className={`nav-link ${currentPath === '/' ? "active" : ""}`}>Home</Link>
            <Link to="/routes" className={`nav-link ${currentPath === '/routes' ? "active" : ""}`}>Routes</Link>
            <Link to="/services" className={`nav-link ${currentPath === '/services' ? "active" : ""}`}>Services</Link>
            <Link to="/about" className={`nav-link ${currentPath === "/about" ? "active" : ""}`}>About</Link>
            <Link to="/contact" className={`nav-link ${currentPath === '/contact' ? "active" : ""}`}>Contact</Link>

            {/* Phone Number in Mobile Menu */}
            <Link to="tel:+9779841000000" className="phone-number">
              <Phone className="phone-icon" />
              <span>+977 9841 000000</span>
            </Link>

            {isAuthenticated ? (
              <>
                <span className="user-info">
                  <CircleUserRound className="icon" /> {user || 'Loading...'}
                </span>
                <button className="logout-button" onClick={handleLogout}>
                  <LogOut className="icon" /> Logout
                </button>
              </>
            ) : (
              <Link to="/sign-in" className="sign-in">
                <LogIn className="icon" /> Sign In
              </Link>
            )}

            <button className="book-now">
              <Book className="icon" /> Book Now
            </button>
          </nav>
        )}
      </div>
    </header>
    </>
  );
}
