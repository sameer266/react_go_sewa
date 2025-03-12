// components/FeaturesSection.jsx
import React, { useEffect } from 'react';
import { Search, CreditCard, Clock, Shield } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import '../../style/home/featuresSection.css'; // Import the CSS file

export default function FeaturesSection() {
  const features = [
    {
      icon: <Search className="feature-icon" />,
      title: "Easy Booking",
      description: "Book your tickets in just a few clicks with our user-friendly interface",
    },
    {
      icon: <CreditCard className="feature-icon" />,
      title: "Secure Payments",
      description: "Multiple payment options with secure transaction processing",
    },
    {
      icon: <Clock className="feature-icon" />,
      title: "24/7 Support",
      description: "Our customer support team is available round the clock to assist you",
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Guaranteed Safety",
      description: "All our partner buses follow strict safety protocols for your journey",
    },
  ];

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      once: true, // Animate only once on scroll
    });
  }, []);

  return (
    <section className="features-section">
      <div className="container">
        {/* Heading */}
        <div
          className="section-heading"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2>Why Choose Go Sewa</h2>
          <p>Discover a seamless bus booking experience with unmatched convenience and trust.</p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay={`${200 + index * 100}`} // Staggered animation
            >
              {/* Icon with Gradient Background */}
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              {/* Subtle Hover Overlay */}
              <div className="feature-overlay"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}