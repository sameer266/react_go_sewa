// components/Route.jsx
import React, { useState, useEffect } from 'react';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt, FaSearch, FaStar, FaClock, FaWifi, FaPlug, FaSnowflake } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../style/home/route.css';

// Sample route data (replace with actual API call in production)
const popularRoutes = [
  {
    id: 1,
    from: 'Kathmandu',
    to: 'Pokhara',
    duration: '7 hours',
    price: 1200,
    rating: 4.8,
    image: '/images/pokhara.jpg',
    amenities: ['wifi', 'charging', 'ac']
  },
  {
    id: 2,
    from: 'Kathmandu',
    to: 'Chitwan',
    duration: '5 hours',
    price: 900,
    rating: 4.6,
    image: '/images/chitwan.jpg',
    amenities: ['wifi', 'charging', 'ac']
  },
  {
    id: 3,
    from: 'Pokhara',
    to: 'Lumbini',
    duration: '6 hours',
    price: 1100,
    rating: 4.7,
    image: '/images/lumbini.jpg',
    amenities: ['wifi', 'ac']
  },
  {
    id: 4,
    from: 'Kathmandu',
    to: 'Nagarkot',
    duration: '2 hours',
    price: 500,
    rating: 4.5,
    image: '/images/nagarkot.jpg',
    amenities: ['charging']
  },
  {
    id: 5,
    from: 'Kathmandu',
    to: 'Janakpur',
    duration: '8 hours',
    price: 1300,
    rating: 4.4,
    image: '/images/janakpur.jpg',
    amenities: ['wifi', 'charging', 'ac']
  },
  {
    id: 6,
    from: 'Birgunj',
    to: 'Kathmandu',
    duration: '6 hours',
    price: 1000,
    rating: 4.5,
    image: '/images/kathmandu.jpg',
    amenities: ['wifi', 'ac']
  }
];

export default function RoutePage() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [locations, setLocations] = useState([
    'Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Nagarkot', 'Janakpur', 'Birgunj'
  ]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true
    });
  }, []);

  // Function to swap locations
  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Filter routes based on search criteria
    const results = popularRoutes.filter(route => 
      (fromLocation === '' || route.from.toLowerCase() === fromLocation.toLowerCase()) &&
      (toLocation === '' || route.to.toLowerCase() === toLocation.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearched(true);
    
    // Scroll to results section
    setTimeout(() => {
      document.getElementById('search-results').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Function to render amenity icons
  const renderAmenities = (amenities) => {
    return (
      <div className="amenities">
        {amenities.includes('wifi') && <FaWifi title="WiFi" />}
        {amenities.includes('charging') && <FaPlug title="Charging Points" />}
        {amenities.includes('ac') && <FaSnowflake title="Air Conditioning" />}
      </div>
    );
  };

  return (
    <div className="route-page">
      {/* Hero Section */}
      <div className="route-hero" data-aos="fade-down">
        <div className="route-hero-content">
          <h1>Discover Your Perfect Journey</h1>
          <p>Find and book bus tickets to your favorite destinations</p>
        </div>
      </div>

      {/* Search Form Section */}
      <div className="search-form-container" data-aos="fade-up" data-aos-delay="200">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label>
              <FaMapMarkerAlt className="form-icon" />
              <span>From</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="Departure City"
                list="from-locations"
              />
              <datalist id="from-locations">
                {locations.map((location, index) => (
                  <option key={`from-${index}`} value={location} />
                ))}
              </datalist>
            </div>
          </div>

          <button type="button" className="swap-button" onClick={swapLocations}>
            <FaExchangeAlt />
          </button>

          <div className="form-group">
            <label>
              <FaMapMarkerAlt className="form-icon" />
              <span>To</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="Destination City"
                list="to-locations"
              />
              <datalist id="to-locations">
                {locations.map((location, index) => (
                  <option key={`to-${index}`} value={location} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaCalendarAlt className="form-icon" />
              <span>Date</span>
            </label>
            <div className="input-wrapper">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button type="submit" className="search-button">
            <FaSearch className="search-icon" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Search Results Section */}
      <div id="search-results" className="search-results-container">
        {isSearched && (
          <div className="search-summary" data-aos="fade-up">
            <h2>
              {searchResults.length > 0 
                ? `Found ${searchResults.length} routes from ${fromLocation || 'anywhere'} to ${toLocation || 'anywhere'}`
                : `No routes found from ${fromLocation || 'anywhere'} to ${toLocation || 'anywhere'}`
              }
            </h2>
            {date && <p>For: {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
          </div>
        )}

        {isSearched && searchResults.length > 0 ? (
          <div className="route-results">
            {searchResults.map((route, index) => (
              <div 
                key={route.id} 
                className="route-card" 
                data-aos="zoom-in" 
                data-aos-delay={index * 100}
              >
                <div className="route-image">
                  <div className="image-placeholder" style={{ backgroundImage: `url('/api/placeholder/400/250')` }}></div>
                  <div className="route-badge">
                    <FaBus />
                    <span>{route.duration}</span>
                  </div>
                </div>
                <div className="route-details">
                  <div className="route-locations">
                    <h3>{route.from} to {route.to}</h3>
                  </div>
                  <div className="route-info">
                    <div className="route-duration">
                      <FaClock />
                      <span>{route.duration}</span>
                    </div>
                    <div className="route-rating">
                      <FaStar />
                      <span>{route.rating}/5</span>
                    </div>
                  </div>
                  {renderAmenities(route.amenities)}
                  <div className="route-footer">
                    <div className="route-price">
                      <span className="price-label">Starting from</span>
                      <span className="price-value">NPR {route.price}</span>
                    </div>
                    <button className="book-button">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isSearched ? (
          <div className="no-results" data-aos="fade-up">
            <div className="no-results-icon">
              <FaBus />
            </div>
            <h3>No routes found</h3>
            <p>Try adjusting your search criteria or explore our popular routes below</p>
          </div>
        ) : null}
      </div>

      {/* Popular Routes Section */}
      <div className="popular-routes-container">
        <h2 className="section-title" data-aos="fade-up">Today Routes</h2>
        <div className="popular-routes">
          {popularRoutes.slice(0, 4).map((route, index) => (
            <div 
              key={route.id} 
              className="route-card" 
              data-aos="flip-up" 
              data-aos-delay={index * 100}
            >
              <div className="route-image">
                <div className="image-placeholder" style={{ backgroundImage: `url('/api/placeholder/400/250')` }}></div>
                <div className="route-badge">
                  <FaBus />
                  <span>{route.duration}</span>
                </div>
              </div>
              <div className="route-details">
                <div className="route-locations">
                  <h3>{route.from} to {route.to}</h3>
                </div>
                <div className="route-info">
                  <div className="route-duration">
                    <FaClock />
                    <span>{route.duration}</span>
                  </div>
                  <div className="route-rating">
                    <FaStar />
                    <span>{route.rating}/5</span>
                  </div>
                </div>
                {renderAmenities(route.amenities)}
                <div className="route-footer">
                  <div className="route-price">
                    <span className="price-label">Starting from</span>
                    <span className="price-value">NPR {route.price}</span>
                  </div>
                  <button className="book-button">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="why-choose-us" data-aos="fade-up">
        <h2 className="section-title">Why Choose Go Sewa</h2>
        <div className="features-grid">
          <div className="feature-card" data-aos="fade-right" data-aos-delay="100">
            <div className="feature-icon">
              <FaBus />
            </div>
            <h3>Extensive Route Network</h3>
            <p>Access to over 500 routes across the country with multiple departure times</p>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div className="feature-icon">
              <FaWifi />
            </div>
            <h3>Modern Amenities</h3>
            <p>Enjoy comfortable journeys with WiFi, charging ports, and air conditioning</p>
          </div>
          <div className="feature-card" data-aos="fade-left" data-aos-delay="300">
            <div className="feature-icon">
              <FaStar />
            </div>
            <h3>Top-Rated Service</h3>
            <p>Consistently high reviews from our satisfied customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}