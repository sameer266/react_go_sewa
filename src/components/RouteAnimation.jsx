import React, { useState, useEffect } from 'react';
import { MapPin, Bus, Calendar, ArrowRight } from 'lucide-react';

const RouteAnimation = () => {
  const [activeRoute, setActiveRoute] = useState(0);
  
  const popularRoutes = [
    { from: 'Kathmandu', to: 'Pokhara', duration: '7 hrs', distance: '200 km', price: 'NPR 800-1200' },
    { from: 'Kathmandu', to: 'Chitwan', duration: '5 hrs', distance: '150 km', price: 'NPR 600-900' },
    { from: 'Pokhara', to: 'Lumbini', duration: '6 hrs', distance: '180 km', price: 'NPR 700-1100' },
    { from: 'Kathmandu', to: 'Nagarkot', duration: '1.5 hrs', distance: '32 km', price: 'NPR 250-400' },
    { from: 'Kathmandu', to: 'Janakpur', duration: '8 hrs', distance: '235 km', price: 'NPR 900-1400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoute((prev) => (prev + 1) % popularRoutes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [popularRoutes.length]);

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Popular Routes in Nepal</h2>
      
      <div className="flex flex-col space-y-6">
        {/* Animation Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 relative overflow-hidden">
          {/* Animated Bus */}
          <div className="absolute top-6 w-full">
            <div 
              className="transition-all duration-1000 ease-in-out flex items-center"
              style={{ 
                transform: `translateX(${activeRoute * 10}%)`,
              }}
            >
              <Bus className="text-yellow-400 h-8 w-8" />
              <div className="h-1 bg-gradient-to-r from-yellow-400 to-transparent w-16 ml-2"></div>
            </div>
          </div>
          
          {/* Route Information */}
          <div className="mt-10 pt-4 text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <MapPin className="text-red-400 mr-2" size={20} />
                <span className="text-xl font-semibold">{popularRoutes[activeRoute].from}</span>
              </div>
              <ArrowRight className="mx-2 text-gray-300" />
              <div className="flex items-center">
                <MapPin className="text-green-400 mr-2" size={20} />
                <span className="text-xl font-semibold">{popularRoutes[activeRoute].to}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <Calendar size={18} className="inline-block mb-1 text-blue-300" />
                <p className="text-sm text-gray-300">Duration</p>
                <p className="font-bold">{popularRoutes[activeRoute].duration}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 mb-1 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-sm text-gray-300">Distance</p>
                <p className="font-bold">{popularRoutes[activeRoute].distance}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 mb-1 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-300">Fare Range</p>
                <p className="font-bold">{popularRoutes[activeRoute].price}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Route Selector */}
        <div className="flex justify-center space-x-2">
          {popularRoutes.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveRoute(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                activeRoute === index ? 'bg-yellow-400 w-6' : 'bg-gray-400 bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:-translate-y-1">
          Book Your Ticket Now
        </button>
      </div>
    </div>
  );
};

export default RouteAnimation;