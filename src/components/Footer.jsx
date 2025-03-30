// components/Footer.jsx
import React, { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import '../style/home/componentCss/footer.css'; // Import the CSS file
import { NavAndContactApi } from '../api/homeApi';

export default function Footer() {

  const [data,setData]=useState({})

  useEffect(()=>{
    const fetchData = async ()=>{
      const response = await NavAndContactApi();
      if (response?.success){
        setData(response.data);
      }
    };
    fetchData();
  }, [])
  return (
    <footer className="footer">
      <div className="container">
        {/* Footer Grid */}
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Go Sewa</h3>
            <p className="footer-text">
              Your trusted partner for seamless bus ticket booking. Discover the best routes, secure payments, and 24/7 support.
            </p>
            {/* Social Media Links */}
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram className="social-icon" />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin className="social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link">Home</a>
              </li>
              <li>
                <a href="/all-routes" className="footer-link">Routes</a>
              </li>
              <li>
                <a href="#" className="footer-link">Services</a>
              </li>
              <li>
                <a href="#" className="footer-link">About Us</a>
              </li>
              <li>
                <a href="#" className="footer-link">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>{data.address}</span>
              </li>
              <li className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+977-{data.phone}</span>
              </li>
              <li className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>{data.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section">
            <h3 className="footer-heading">Newsletter</h3>
            <p className="footer-text">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-copyright">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Go Sewa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}