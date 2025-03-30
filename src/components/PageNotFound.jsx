import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Bus, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function BusBooking404() {
  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      easing: "ease-in-out",
      once: true 
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white overflow-hidden relative">
      {/* Road Background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-500 dark:bg-gray-700 z-0"></div>
      
      {/* Bus Lane Markings */}
      <div className="absolute bottom-16 left-0 right-0 h-1 bg-white dark:bg-gray-600 z-10 flex">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="w-16 h-full bg-white dark:bg-gray-600 mr-8"
            style={{ 
              transform: `translateX(${i * 100}%)`,
              animation: `road-line 2s linear infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div 
        data-aos="fade-up" 
        className="z-20 flex flex-col items-center text-center px-4"
      >
        <div className="relative">
          <Bus 
            size={120} 
            className="text-blue-600 dark:text-blue-400 animate-bounce" 
            strokeWidth={1.5}
          />
          <AlertTriangle 
            size={40} 
            className="absolute top-0 right-0 text-red-500 animate-pulse" 
          />
        </div>
        
        <h1 
          data-aos="zoom-in" 
          className="text-7xl font-extrabold mt-4 text-blue-800 dark:text-blue-300"
        >
          404
        </h1>
        
        <p 
          data-aos="fade-in" 
          className="text-2xl mt-2 text-gray-600 dark:text-gray-300 max-w-md"
        >
          Looks like this bus route doesn't exist! The page you're searching for took a different turn.
        </p>
        
        <Link
          to="/"
          data-aos="zoom-in"
          className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg 
            hover:bg-blue-700 transition-all transform hover:scale-105 
            flex items-center space-x-2 group"
        >
          <Bus className="group-hover:animate-bounce" size={24} />
          <span>Return to Main Station</span>
        </Link>
      </div>

      <style jsx>{`
        @keyframes road-line {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}