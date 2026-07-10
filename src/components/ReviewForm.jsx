// src/components/ReviewForm.jsx
import { useState } from 'react';
import * as reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import { Star, AlertTriangle } from 'lucide-react';

export default function ReviewForm({ movieId, movieTitle, moviePoster, onRefresh }) {
  const { token } = useAuth();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const maxLength = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;
    if (!token) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      // Backend requires: movieId, movieTitle, rating, review (not 'text')
      await reviewService.createReview({
        movieId,
        movieTitle: movieTitle || String(movieId),
        moviePoster: moviePoster || '',
        rating,
        review: text,   // backend field is 'review', not 'text'
      }, token);
      setRating(0);
      setText('');
      onRefresh();
    } catch (err) {
      console.error('Create review failed', err);
      setErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className="star"
          style={{ cursor: 'pointer', display: 'inline-flex', padding: '0 2px' }}
          onClick={() => setRating(i)}
          aria-hidden="true"
        >
          <Star size={24} fill={i <= rating ? 'var(--color-gold)' : 'none'} color={i <= rating ? 'var(--color-gold)' : 'var(--color-muted)'} />
        </span>
      );
    }
    return <div className="review-form__stars" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>{stars}</div>;
  };

  return (
    <form className="review-form glass-card" onSubmit={handleSubmit}>
      <h3 className="review-form__title">Write a Review</h3>
      {renderStars()}
      <textarea
        className="review-form__textarea"
        placeholder="Your review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={maxLength}
        rows={4}
        required
      />
      {errorMsg && (
        <p style={{ color: 'var(--color-accent, #e50914)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={14} /> {errorMsg}
        </p>
      )}
      <div className="review-form__footer">
        <span className="review-form__counter">
          {text.length}/{maxLength}
        </span>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting || rating === 0 || !text.trim()}
        >
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}

ReviewForm.propTypes = {
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  movieTitle: PropTypes.string,
  moviePoster: PropTypes.string,
  onRefresh: PropTypes.func.isRequired,
};
