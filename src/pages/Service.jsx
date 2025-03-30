import React, { useState, useEffect } from 'react';
import { Bus, Ticket, Clock, Map, Mountain, Hotel, Utensils, Loader2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import '../style/home/service.css';
import { AllRoutesApi } from '../api/homeApi';

const Service = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchRoutes = async () => {
      try {
        const response = await AllRoutesApi();
        if (response.success) {
          setRoutes(response.data);
        } else {
          setError('Failed to fetch routes');
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
        setError('An error occurred while fetching routes');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Static services data
  const services = [
    { id: 1, title: "Tourist Bus", icon: Bus, description: "Modern air-conditioned buses with comfortable seating, free WiFi, and professional drivers.", features: ["Air Conditioning", "Reclining Seats", "WiFi", "Entertainment", "Toilet"], isActive: true },
    { id: 2, title: "Deluxe Bus", icon: Bus, description: "Premium travel experience with extra leg room, charging ports, and complimentary refreshments.", features: ["Extra Leg Room", "Charging Ports", "Refreshments", "Entertainment", "Toilet"], isActive: true },
    { id: 3, title: "Local Bus", icon: Bus, description: "Affordable transportation to remote destinations throughout Nepal.", features: ["Economic Pricing", "Regular Departures", "Extensive Network"], isActive: false },
    { id: 4, title: "Package Tours", icon: Map, description: "Complete travel packages including transportation, accommodation, and guided tours.", features: ["Multi-day Tours", "Professional Guides", "All-inclusive Options"], isActive: true },
    { id: 5, title: "Trek Transportation", icon: Mountain, description: "Specialized transportation to popular trekking starting points around Nepal.", features: ["Early Departures", "Trekking Gear Transport", "Trek Information"], isActive: true },
    { id: 6, title: "Express Bus", icon: Bus, description: "Fast and efficient long-distance buses with minimal stops for quicker travel across cities.", features: ["Faster Travel", "Limited Stops", "Comfortable Seating", "WiFi", "Air Conditioning"], isActive: true },
    { id: 7, title: "Mini Bus", icon: Bus, description: "Compact buses for short-distance trips, ideal for groups or small families.", features: ["Compact Design", "Group Seating", "Air Conditioning", "Affordable Rates"], isActive: true },
    { id: 8, title: "Electric Bus", icon: Bus, description: "Environmentally friendly electric buses offering a quiet, smooth ride with low emissions.", features: ["Eco-friendly", "Electric-powered", "Low Noise", "Comfortable Seats", "Air Conditioning"], isActive: false },
  ];

  const additionalServices = [
    { id: 1, title: "Hotel Booking", icon: Hotel, description: "Book hotels at your destination along with your bus ticket.", isActive: true },
    { id: 2, title: "Meal Packages", icon: Utensils, description: "Pre-order meals for your journey with authentic Nepali options.", isActive: true },
    { id: 3, title: "24/7 Support", icon: Clock, description: "Round-the-clock customer support for any queries or emergencies.", isActive: true },
  ];

  return (
    <div className="service-section">
      <div className="service-container">
        {/* Header */}
        <div className="service-header" data-aos="fade-down">
          <h1>Bus Services in Nepal</h1>
          <p>Explore Nepal's beauty with our comfortable and reliable bus services</p>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="loading-state" data-aos="fade-in">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <p>Loading services and routes...</p>
          </div>
        )}
        {error && (
          <div className="error-state" data-aos="fade-in">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Services */}
        {!loading && !error && (
          <>
            <div className="services-grid" data-aos="fade-up">
              <h2>Our Bus Services</h2>
              <div className="service-cards">
                {services.map((service, index) => (
                  service.isActive && (
                    <div className="service-card" key={service.id} data-aos="zoom-in" data-aos-delay={index * 100}>
                      <div className="service-icon">
                        <service.icon className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <div className="service-features">
                        {service.features.map((feature, featIndex) => (
                          <span key={featIndex} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Routes Section
            {routes.length > 0 && (
              <div className="routes-grid" data-aos="fade-up">
                <h2>Popular Routes</h2>
                <div className="route-cards">
                  {routes.map((route, index) => (
                    <div className="route-card" key={route.id} data-aos="zoom-in" data-aos-delay={index * 100}>
                      <h3>{route.route_name}</h3>
                      <p>From: {route.start_point} - To: {route.end_point}</p>
                      <p>Distance: {route.distance} km</p>
                      <p>Estimated Time: {route.estimated_time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Additional Services */}
            <div className="additional-services" data-aos="fade-up">
              <h2>Additional Services</h2>
              <div className="additional-service-cards">
                {additionalServices.map((service, index) => (
                  service.isActive && (
                    <div className="additional-service-card" key={service.id} data-aos="zoom-in" data-aos-delay={index * 100}>
                      <div className="additional-service-icon">
                        <service.icon className="w-8 h-8 text-green-600" />
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="service-cta" data-aos="fade-up">
              <h2>Ready to Book Your Journey?</h2>
              <p>Experience comfort and reliability on your travels across Nepal</p>
              <button className="book-now-btn">
                <Ticket className="w-5 h-5 mr-2" /> Book Your Ticket Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Service;