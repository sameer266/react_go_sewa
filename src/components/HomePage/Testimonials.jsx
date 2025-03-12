// components/Testimonials.jsx
import React, { useEffect } from 'react';
import { Star } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import '../../style/home/testimonial.css'; // Import the CSS file

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Sharma",
      location: "Kathmandu",
      rating: 5,
      comment:
        "Go Sewa made my travel planning so much easier. The booking process was smooth and the bus was comfortable.",
    },
    {
      name: "Sunita Rai",
      location: "Pokhara",
      rating: 5,
      comment:
        "I've been using Go Sewa for all my bus travels. Their customer service is excellent and the prices are reasonable.",
    },
    {
      name: "Anil Gurung",
      location: "Chitwan",
      rating: 5,
      comment:
        "The buses are always on time, and the staff is very helpful. Highly recommend Go Sewa for hassle-free travel.",
    },
    {
      name: "Priya Thapa",
      location: "Lumbini",
      rating: 5,
      comment:
        "Affordable prices and a great selection of routes. Go Sewa is my go-to for bus bookings!",
    },
  ];

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section className="testimonials-section">
      <div className="container">
        {/* Heading */}
        <div className="section-heading" data-aos="fade-down">
          <h2>What Our Customers Say</h2>
          <p>Hear from travelers who love Go Sewa</p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`} // Staggered animation
            >
              {/* Rating */}
              <div className="rating">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
              </div>

              {/* Comment */}
              <p className="comment">"{testimonial.comment}"</p>

              {/* Name and Location */}
              <div className="user-info">
                <h3 className="user-name">{testimonial.name}</h3>
                <p className="user-location">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}