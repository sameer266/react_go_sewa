import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GlobalTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentContent, setCurrentContent] = useState(children);
  const transitionTimeoutRef = useRef(null);

  const startTransition = useCallback(() => {
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Start the transition
    setIsTransitioning(true);
  }, []);

  useEffect(() => {
    // Reset scroll position
    window.scrollTo(0, 0);

    // Determine if transition is needed
    const shouldTransition = () => {
      // Always transition if content changed
      if (!children || !currentContent) return true;
      
      // Compare keys or content
      return React.Children.count(children) !== React.Children.count(currentContent) || 
             (React.isValidElement(children) && React.isValidElement(currentContent) && 
              children.key !== currentContent.key);
    };

    // Only transition if content has changed
    if (shouldTransition()) {
      startTransition();

      // Complete transition after animation duration
      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentContent(children);
        setIsTransitioning(false);
      }, 400);

      // Cleanup function
      return () => {
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
      };
    }
  }, [children, location.pathname, startTransition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Transition overlay */}
      <div 
        className={`
          fixed 
          inset-0 
          bg-white 
          bg-opacity-95 
          z-[9999] 
          pointer-events-none 
          transition-all 
          duration-400 
          ease-in-out 
          ${isTransitioning 
            ? 'visible opacity-100 translate-y-0' 
            : 'invisible opacity-0 translate-y-full'
          }
        `}
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Current content with transition */}
        <div 
          className={`
            relative 
            transition-opacity 
            duration-400 
            ease-in-out 
            ${isTransitioning 
              ? 'opacity-0 pointer-events-none' 
              : 'opacity-100 pointer-events-auto'
            }
          `}
          key={location.pathname} // Ensure unique key for each route
        >
          {currentContent}
        </div>
      </div>
    </div>
  );
};

export default React.memo(GlobalTransition);