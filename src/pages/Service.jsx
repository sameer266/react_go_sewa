import React, { useState, useEffect } from 'react';
import {
  Bus,
  Map,
  Clock,
  Ticket,
  Umbrella,
  Mountain,
  Hotel,
  Utensils
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import '../style/home/service.css';

const Service = () => {
  const [activeTab, setActiveTab] = useState('domestic');

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Global duration for all animations
      once: true, // Animations happen only once
    });
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const domesticRoutes = [
    { id: 1, from: 'Kathmandu', to: 'Pokhara', departure: '7:00 AM', duration: '7 hours', price: 'NPR 800-1500' },
    { id: 2, from: 'Kathmandu', to: 'Chitwan', departure: '6:30 AM', duration: '5 hours', price: 'NPR 600-1200' },
    { id: 3, from: 'Pokhara', to: 'Lumbini', departure: '8:00 AM', duration: '6 hours', price: 'NPR 700-1300' },
    { id: 4, from: 'Kathmandu', to: 'Nagarkot', departure: '10:00 AM', duration: '2 hours', price: 'NPR 400-700' },
    { id: 5, from: 'Kathmandu', to: 'Janakpur', departure: '5:30 AM', duration: '8 hours', price: 'NPR 900-1600' },
    { id: 6, from: 'Pokhara', to: 'Kathmandu', departure: '6:00 AM', duration: '7 hours', price: 'NPR 800-1500' },
  ];

  const touristicRoutes = [
    { id: 1, from: 'Kathmandu', to: 'Everest Base Camp Trek Start', departure: '5:00 AM', duration: '8 hours', price: 'NPR 1200-2000' },
    { id: 2, from: 'Pokhara', to: 'Annapurna Circuit Trek Start', departure: '6:00 AM', duration: '4 hours', price: 'NPR 700-1200' },
    { id: 3, from: 'Kathmandu', to: 'Langtang Valley Trek Start', departure: '5:30 AM', duration: '7 hours', price: 'NPR 1000-1800' },
    { id: 4, from: 'Kathmandu', to: 'Bhaktapur', departure: '9:00 AM', duration: '1 hour', price: 'NPR 300-500' },
    { id: 5, from: 'Kathmandu', to: 'Patan', departure: '10:00 AM', duration: '40 minutes', price: 'NPR 200-400' },
  ];

  const services = [
    {
      id: 1,
      title: "Tourist Bus",
      icon: Bus,
      description: "Modern air-conditioned buses with comfortable seating, free WiFi, and professional drivers.",
      features: ["Air Conditioning", "Reclining Seats", "WiFi", "TV/Entertainment", "Toilet"]
    },
    {
      id: 2,
      title: "Deluxe Bus",
      icon: Bus,
      description: "Premium travel experience with extra leg room, charging ports, and complimentary refreshments.",
      features: ["Extra Leg Room", "Charging Ports", "Refreshments", "Air Conditioning", "Entertainment System", "Toilet"]
    },
    {
      id: 3,
      title: "Local Bus",
      icon: Bus,
      description: "Affordable transportation to remote destinations throughout Nepal.",
      features: ["Economic Pricing", "Regular Departures", "Extensive Network"]
    },
    {
      id: 4,
      title: "Hiace/Micro Bus",
      icon: Bus,
      description: "Quick travel for shorter routes with smaller group sizes.",
      features: ["Fast Service", "Frequent Departures", "Flexible Routing"]
    },
    {
      id: 5,
      title: "Package Tours",
      icon: Map,
      description: "Complete travel packages including transportation, accommodation, and guided tours.",
      features: ["Multi-day Tours", "Professional Guides", "All-inclusive Options"]
    },
    {
      id: 6,
      title: "Trek Transportation",
      icon: Mountain,
      description: "Specialized transportation to popular trekking starting points around Nepal.",
      features: ["Early Departures", "Trekking Gear Transport", "Trek Information"]
    }
  ];

  const additionalServices = [
    {
      id: 1,
      title: "Hotel Booking",
      icon: Hotel,
      description: "Book hotels at your destination along with your bus ticket for a seamless travel experience."
    },
    {
      id: 2,
      title: "Meal Packages",
      icon: Utensils,
      description: "Pre-order meals for your journey with authentic Nepali and continental options."
    },
    {
      id: 3,
      title: "Travel Insurance",
      icon: Umbrella,
      description: "Get covered for your journey with our affordable travel insurance packages."
    },
    {
      id: 4,
      title: "24/7 Support",
      icon: Clock,
      description: "Round-the-clock customer support for any queries or emergency situations."
    }
  ];

  return (
    <div className="service-section">
      <div className="service-container">
        <div className="service-header" data-aos="fade-down">
          <h1>Bus Services in Nepal</h1>
          <p>Explore Nepal's beauty with our comfortable and reliable bus services</p>
        </div>

        <div className="popular-routes" data-aos="fade-up" data-aos-delay="100">
          <h2>Popular Routes</h2>
          <div className="route-tabs" data-aos="fade-up" data-aos-delay="200">
            <button 
              className={activeTab === 'domestic' ? 'active' : ''} 
              onClick={() => handleTabChange('domestic')}
            >
              Domestic Routes
            </button>
            <button 
              className={activeTab === 'touristic' ? 'active' : ''} 
              onClick={() => handleTabChange('touristic')}
            >
              Tourist Destinations
            </button>
          </div>

          <div className="route-table-container" data-aos="fade-up" data-aos-delay="300">
            <table className="route-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Departure</th>
                  <th>Duration</th>
                  <th>Price Range</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {activeTab === 'domestic' 
                  ? domesticRoutes.map((route, index) => (
                    <tr key={route.id} data-aos="fade-up" data-aos-delay={index * 100}>
                      <td>{route.from}</td>
                      <td>{route.to}</td>
                      <td>{route.departure}</td>
                      <td>{route.duration}</td>
                      <td>{route.price}</td>
                      <td>
                        <button className="book-route">
                          <Ticket className="w-4 h-4 mr-1" /> Book
                        </button>
                      </td>
                    </tr>
                  ))
                  : touristicRoutes.map((route, index) => (
                    <tr key={route.id} data-aos="fade-up" data-aos-delay={index * 100}>
                      <td>{route.from}</td>
                      <td>{route.to}</td>
                      <td>{route.departure}</td>
                      <td>{route.duration}</td>
                      <td>{route.price}</td>
                      <td>
                        <button className="book-route">
                          <Ticket className="w-4 h-4 mr-1" /> Book
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        <div className="services-grid" data-aos="fade-up" data-aos-delay="400">
          <h2>Our Bus Services</h2>
          <div className="service-cards">
            {services.map((service, index) => (
              <div className="service-card" key={service.id} data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="service-icon">
                  <service.icon className="w-8 h-8" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-features">
                  {service.features.map((feature, featIndex) => (
                    <span key={featIndex} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="additional-services" data-aos="fade-up" data-aos-delay="400">
          <h2>Additional Services</h2>
          <div className="additional-service-cards">
            {additionalServices.map((service, index) => (
              <div className="additional-service-card" key={service.id} data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="additional-service-icon">
                  <service.icon className="w-8 h-8" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="service-cta" data-aos="fade-up" data-aos-delay="400">
          <h2>Ready to Book Your Journey?</h2>
          <p>Experience comfort and reliability on your travels across Nepal</p>
          <button className="book-now-btn">
            <Ticket className="w-4 h-4 mr-2" /> Book Your Ticket Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Service;