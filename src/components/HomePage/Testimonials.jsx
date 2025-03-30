import React, { useState, useEffect } from 'react';
import { FaBus, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { AllReviewsApi } from '../../api/homeApi';
import '../../style/home/testimonial.css';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await AllReviewsApi();
        if (response?.success) {
          setReviews(response.data);
        } else {
          setError('Failed to fetch reviews.');
        }
      } catch {
        setError('Error fetching reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <>
        {Array(fullStars).fill(<FaStar className="star-icon" />)}
        {halfStar && <FaStarHalfAlt className="star-icon" />}
        {Array(emptyStars).fill(<FaRegStar className="star-icon" />)}
      </>
    );
  };

  return (
    <section className="reviews">
      <div className="container">
        <h2>Customer Reviews</h2>
        <p>What our customers have to say</p>
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="bus-info">
                <FaBus className="bus-icon" />
                <span>{review.bus.bus_type}</span>
              </div>
              <div className="review-rating">{renderStars(review.rating)}</div>
              <div className="review-route">
                {review.route.source} → {review.route.destination}
              </div>
              <p>{review.comment}</p>
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
