import React, { useState, useEffect } from 'react';
import { FaBus } from 'react-icons/fa';
import { AllReviewsApi } from '../../api/homeApi'; // Assuming AllReviewsApi is exported from homeApi.js
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import '../../style/home/testimonial.css'; // Import the CSS file

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Import star icons

export default function Reviews() {
  const [reviews, setReviews] = useState([]); // State to hold fetched reviews
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state to handle any errors during fetching

  // Fetch reviews when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      once: true, // Animate only once on scroll
    });

    // Fetch data from the API
    const fetchReviews = async () => {
      try {
        const response = await AllReviewsApi(); // Make the API call
        if (response?.success) {
          setReviews(response.data); // Set the fetched reviews to state
        } else {
          setError("Failed to fetch reviews."); // Set error if no data returned
        }
      } catch (err) {
        setError("Error fetching reviews."); // Handle any other errors
      } finally {
        setLoading(false); // Set loading to false once the request is done
      }
    };

    fetchReviews(); // Call the function to fetch reviews
  }, []);

  // If the data is still being fetched
  if (loading) {
    return <div>Loading reviews...</div>;
  }

  // If there was an error during fetching
  if (error) {
    return <div>{error}</div>;
  }

  // Function to render the stars for rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <>
        {Array(fullStars).fill(<FaStar className="star-icon" />)}
        {halfStars && <FaStarHalfAlt className="star-icon" />}
        {Array(emptyStars).fill(<FaRegStar className="star-icon" />)}
      </>
    );
  };

  return (
    <section className="reviews">
      <div className="container">
        {/* Heading */}
        <div className="section-heading" data-aos="fade-down" data-aos-delay="100">
          <h2>Customer Reviews</h2>
          <p>What our customers have to say</p>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="review-card"
              data-aos="fade-up"
              data-aos-delay={`${200 + index * 100}`} // Staggered animation for each card
            >
              {/* Bus Type */}
              <div className="bus-info">
                <FaBus className="bus-icon" />
                <span className="bus-type">{review.bus.bus_type}</span>
              </div>

              {/* Rating */}
              <div className="review-rating">
                <div className="stars">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Route Information */}
              <div className="review-route">
                <span className="route-label">Route: </span>
                <span className="route-info">
                  {review.route.source} → {review.route.destination}
                </span>
              </div>

              {/* Comment */}
              <div className="review-comment">
                <p>{review.comment}</p>
              </div>

              {/* Date */}
              <div className="review-date">
                <span>{new Date(review.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
