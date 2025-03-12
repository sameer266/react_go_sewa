// components/PopularRoutes.jsx
import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { FaBus } from 'react-icons/fa'; // Using react-icons for an additional bus icon
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import '../../style/home/popularRoutes.css'; // Import the CSS file

export default function PopularRoutes() {
  const routes = [
    { from: "Kathmandu", to: "Pokhara", price: "Rs. 800", image: "https://via.placeholder.com/300x200" },
    { from: "Kathmandu", to: "Chitwan", price: "Rs. 650", image: "https://via.placeholder.com/300x200" },
    { from: "Pokhara", to: "Lumbini", price: "Rs. 750", image: "https://via.placeholder.com/300x200" },
    { from: "Kathmandu", to: "Janakpur", price: "Rs. 900", image: "https://via.placeholder.com/300x200" },
  ];

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      once: true, // Animate only once on scroll
    });
  }, []);

  return (
    <section className="popular-routes">
      <div className="container">
        {/* Heading */}
        <div
          className="section-heading"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2>Popular Routes</h2>
          <p>Explore our most booked destinations</p>
        </div>

        {/* Routes Grid */}
        <div className="routes-grid">
          {routes.map((route, index) => (
            <div
              key={index}
              className="route-card"
              data-aos="fade-up"
              data-aos-delay={`${200 + index * 100}`} // Staggered animation for each card
            >
              {/* Route Image */}
              <img
                src={route.image || "https://via.placeholder.com/300x200"}
                alt={`${route.from} to ${route.to}`}
                className="route-image"
              />

              {/* Route Details */}
              <div className="route-details">
                <div className="route-info">
                  <div className="route-from">
                    <FaBus className="bus-icon" />
                    <span>{route.from}</span>
                  </div>
                  <ChevronRight className="arrow-icon" />
                  <span className="route-to">{route.to}</span>
                </div>

                {/* Price */}
                <div className="route-price">
                  <span>Starting from</span>
                  <span className="price">{route.price}</span>
                </div>

                {/* Book Now Button */}
                <button className="book-now-button">Book Now</button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Routes Button */}
        <div
          className="view-all-button-container"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <button className="view-all-button">View All Routes</button>
        </div>
      </div>
    </section>
  );
}