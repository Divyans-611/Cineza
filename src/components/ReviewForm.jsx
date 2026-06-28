// src/components/ReviewForm.jsx
import { useState } from 'react';
import * as reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

export default function ReviewForm({ movieId, onRefresh }) {
  const { token } = useAuth();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const maxLength = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;
    if (!token) return;
    setSubmitting(true);
    try {
      await reviewService.createReview({ movieId, rating, text }, token);
      setRating(0);
      setText('');
      onRefresh();
    } catch (err) {
      console.error('Create review failed', err);
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
          className={i <= rating ? 'star star--filled' : 'star star--empty'}
          style={{ cursor: 'pointer' }}
          onClick={() => setRating(i)}
          aria-hidden="true"
        >
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return <div className="review-form__stars">{stars}</div>;
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
  onRefresh: PropTypes.func.isRequired,
};
