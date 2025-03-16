import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { FaBus } from 'react-icons/fa'; // Using react-icons for an additional bus icon
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import '../../style/home/popularRoutes.css'; // Import the CSS file

import { PopularRoutesApi } from '../../api/homeApi'; // Assuming PopularRoutesApi is exported from homeApi.js
import { Link } from 'react-router-dom';

export default function PopularRoutes() {
  const [popularRoutes, setPopularRoutes] = useState([]);  // State to hold fetched routes
  const [loading, setLoading] = useState(true);  // Loading state for fetching data
  const [error, setError] = useState(null);  // Error state to handle any errors during fetching

  // Fetch popular routes when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      once: true, // Animate only once on scroll
    });

    // Fetch data from the API
    const fetchPopularRoutes = async () => {
      try {
        const response = await PopularRoutesApi(); // Make the API call
        if (response?.success) {
          setPopularRoutes(response.data);  // Set the fetched data to state
        } else {
          setError("Failed to fetch routes.");  // Set error if no data returned
        }
      } catch (err) {
        setError("Error fetching popular routes.");  // Handle any other errors
      } finally {
        setLoading(false);  // Set loading to false once the request is done
      }
    };

    fetchPopularRoutes();  // Call the function to fetch data
  }, []);

  // If the data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there was an error during fetching
  if (error) {
    return <div>{error}</div>;
  }

  // Static images array (assuming you want 4 different images for the cards)
  const staticImages = [
    'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2F0aG1hbmR1fGVufDB8MHwwfHx8MA%3D%3D', 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbmGiF3kl1hDYb-sAEY-T3KrB1JOUL4Ait6g&s', 
    'https://powertraveller.com/wp-content/uploads/2024/08/kathmandu-to-pokhara-car-transfer.jpg', 
    'hhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXeyX3l3rvOYUGexdez3XStzQY6NPAKgbNuw&s'
  ];

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
          {popularRoutes.slice(0, 4).map((route, index) => (
            <div
              key={index}
              className="route-card"
              data-aos="fade-up"
              data-aos-delay={`${200 + index * 100}`} // Staggered animation for each card
            >
              {/* Route Image */}
              <img
                src={staticImages[index % staticImages.length]}  // Reuse 4 static images in a cycle
                alt={`${route.source} to ${route.destination}`}
                className="route-image"
              />

              {/* Route Details */}
              <div className="route-details">
                <div className="route-info">
                  <div className="route-from">
                    <FaBus className="bus-icon" />
                    <span>{route.source}</span>
                  </div>
                  <ChevronRight className="arrow-icon" />
                  <span className="route-to">{route.destination}</span>
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
          <Link to="/all-routes">
            <button className="view-all-button">View All Routes</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
