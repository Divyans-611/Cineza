// src/components/ReviewsSection.jsx
import { useEffect, useState, useCallback } from 'react';
import * as reviewService from '../services/reviewService';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';

export default function ReviewsSection({ movieId, movieTitle, moviePoster }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // useAuth() must always be called at the top level — never conditionally
  const { user } = useAuth();

  const loadReviews = useCallback(() => {
    if (!movieId) return;
    setLoading(true);
    setError(null);
    reviewService
      .getMovieReviews(movieId)
      .then((data) => {
        setReviews(data || []);
      })
      .catch((err) => {
        console.error('Failed to load reviews:', err);
        setError(err.message || 'Unable to fetch reviews');
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  if (loading) {
    return <p className="reviews-loading">Loading reviews…</p>;
  }

  if (error) {
    return <p className="reviews-error">Error: {error}</p>;
  }

  const hasReviewed = user && reviews.some(r => r.username === user.username);

  if (!reviews.length) {
    return (
      <section className="reviews-section glass-card">
        <h2 className="reviews-section__title">Community Reviews</h2>
        <p className="reviews-empty">
          No reviews yet.<br />
          Be the first person to review this movie.
        </p>
        {user && !hasReviewed && (
          <ReviewForm movieId={movieId} movieTitle={movieTitle} moviePoster={moviePoster} onRefresh={loadReviews} />
        )}
      </section>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / (reviews.length || 1);

  return (
    <section className="reviews-section glass-card">
      <h2 className="reviews-section__title">Community Reviews</h2>
      <div className="reviews-stats">
        <span className="reviews-stats__average">Average Rating: {avgRating.toFixed(1)} ★</span>
        <span className="reviews-stats__count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="reviews-list">
        {reviews.map((rev) => (
          <ReviewCard key={rev._id || rev.id} review={rev} onRefresh={loadReviews} />
        ))}
      </div>
      {user && !hasReviewed && (
        <ReviewForm movieId={movieId} movieTitle={movieTitle} moviePoster={moviePoster} onRefresh={loadReviews} />
      )}
    </section>
  );
}
