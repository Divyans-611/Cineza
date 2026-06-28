// src/components/ReviewsSection.jsx
import { useEffect, useState } from 'react';
import * as reviewService from '../services/reviewService';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';

export default function ReviewsSection({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    reviewService
      .getMovieReviews(movieId)
      .then((data) => {
        setReviews(data || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load reviews:', err);
        setError(err.message || 'Unable to fetch reviews');
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) {
    return <p className="reviews-loading">Loading reviews…</p>;
  }

  if (error) {
    return <p className="reviews-error">Error: {error}</p>;
  }

  if (!reviews.length) {
    const { user } = useAuth();
    const hasReviewed = reviews.some(r => user && r.username === user.username);
    return (
      <section className="reviews-section glass-card">
        <h2 className="reviews-section__title">Community Reviews</h2>
        <p className="reviews-empty">
          No reviews yet.<br />
          Be the first person to review this movie.
        </p>
        {user && !hasReviewed && (
          <ReviewForm movieId={movieId} onRefresh={() => { setLoading(true); setError(null); }} />
        )}
      </section>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / (reviews.length || 1);
  const { user } = useAuth();
  const hasReviewed = user && reviews.some(r => r.username === user.username);
  return (
    <section className="reviews-section glass-card">
      <h2 className="reviews-section__title">Community Reviews</h2>
      <div className="reviews-stats">
        <span className="reviews-stats__average">Average Rating: {avgRating.toFixed(1)} ★</span>
        <span className="reviews-stats__count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="reviews-list">
        {reviews.map((rev) => (
          <ReviewCard key={rev.id} review={rev} onRefresh={() => { setLoading(true); setError(null); }} />
        ))}
      </div>
      {user && !hasReviewed && (
        <ReviewForm movieId={movieId} onRefresh={() => { setLoading(true); setError(null); }} />
      )}
    </section>
  );
}
