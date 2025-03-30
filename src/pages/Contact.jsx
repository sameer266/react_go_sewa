// components/Contact.jsx
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import '../style/home/contact.css'; // Import the CSS file
import { NavAndContactApi } from '../api/homeApi';

export default function Contact() {

  const [contactData,setContactData]=useState({})

  const fetchData = async ()=>{
    const response = await NavAndContactApi();
    if (response?.success){
      setContactData(response.data)
      console.log("Data",response.data)
    }
  }
  // Initialize AOS for animations
  useEffect(() => {

    fetchData();

    AOS.init({
      duration: 800, // Animation duration in milliseconds
      once: true, // Animate only once on scroll
    });
  }, []);

  return (
    <section className="contact-section">
      <div className="container">
        {/* Heading */}
        <div
          className="section-heading"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2>Contact Us</h2>
          <p>We're here to help! Reach out to us for any questions or concerns.</p>
        </div>

        {/* Contact Grid */}
        <div className="contact-grid">
          {/* Left Side: Contact Information */}
          <div
            className="contact-info"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <h3 className="contact-title">Get in Touch</h3>
            <p className="contact-description">
              Have a question or need assistance? Feel free to contact us via phone, email, or visit
              our office. We're always happy to help!
            </p>
            <ul className="contact-details">
              <li className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h4>Our Office</h4>
                  <p>{contactData.address} Nepal</p>
                </div>
              </li>
              <li className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <h4>Call Us</h4>
                  <p>+977-{contactData.phone}</p>
                </div>
              </li>
              <li className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h4>Email Us</h4>
                  <p>{contactData.email}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Side: Contact Form */}
          <div
            className="contact-form"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <h3 className="contact-title">Send Us a Message</h3>
            <form className="form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Subject"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Your Message"
                  className="form-textarea"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className="form-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}