// src/components/ReviewsSection.jsx
import { useEffect, useState, useCallback } from 'react';
import * as reviewService from '../services/reviewService';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

export default function ReviewsSection({ movieId, movieTitle, moviePoster, mediaType = 'movie' }) {
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
      .getMovieReviews(movieId, mediaType)
      .then((data) => {
        setReviews(data || []);
      })
      .catch((err) => {
        console.error('Failed to load reviews:', err);
        setError(err.message || 'Unable to fetch reviews');
      })
      .finally(() => setLoading(false));
  }, [movieId, mediaType]);

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
          Be the first person to review this media.
        </p>
        {user && !hasReviewed && (
          <ReviewForm movieId={movieId} movieTitle={movieTitle} moviePoster={moviePoster} onRefresh={loadReviews} mediaType={mediaType} />
        )}
      </section>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / (reviews.length || 1);

  return (
    <section className="reviews-section glass-card">
      <h2 className="reviews-section__title">Community Reviews</h2>
      <div className="reviews-stats">
        <span className="reviews-stats__average" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Average Rating: {avgRating.toFixed(1)} <Star size={14} fill="currentColor" color="var(--color-gold)" /></span>
        <span className="reviews-stats__count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="reviews-list">
        {reviews.map((rev) => (
          <ReviewCard key={rev._id || rev.id} review={rev} onRefresh={loadReviews} />
        ))}
      </div>
      {user && !hasReviewed && (
        <ReviewForm movieId={movieId} movieTitle={movieTitle} moviePoster={moviePoster} onRefresh={loadReviews} mediaType={mediaType} />
      )}
    </section>
  );
}
