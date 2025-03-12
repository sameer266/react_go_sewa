import React, { useState, useEffect } from 'react';
import Hero from '../components/HomePage/Hero';
import FeaturesSection from '../components/HomePage/FeatureSection';
import PopularRoutes from '../components/HomePage/PopularRoutes';
import Testimonials from '../components/HomePage/Testimonials';
import RouteAnimation from '../components/RouteAnimation';
import Loader from '../components/Loader';

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay (e.g., fetching data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 2 seconds
    }, 2000); // Adjust this delay as needed

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader /> // Display loader while loading
      ) : (
        <>
          <Hero />
          <FeaturesSection />
          <PopularRoutes />
          <RouteAnimation />
          <Testimonials />
        </>
      )}
    </>
  );
}

export default Home;