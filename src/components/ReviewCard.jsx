// src/components/ReviewCard.jsx
import { useState } from 'react';
import * as reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

export default function ReviewCard({ review, onRefresh }) {
  const { user, token } = useAuth();
  const isOwner = user && (review.username === user.username || review.userId === user.id);
  const [editMode, setEditMode] = useState(false);
  const [rating, setRating] = useState(Number(review.rating));
  const [text, setText] = useState(review.text);
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      await reviewService.deleteReview(review.id, token);
      onRefresh();
    } catch (err) {
      console.error('Delete review failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      await reviewService.updateReview(review.id, { rating, text }, token);
      setEditMode(false);
      onRefresh();
    } catch (err) {
      console.error('Update review failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= value ? 'star star--filled' : 'star star--empty'}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onClick={interactive ? () => setRating(i) : undefined}
          aria-hidden="true"
        >
          {i <= value ? '★' : '☆'}
        </span>
      );
    }
    return <div className="review-card__stars">{stars}</div>;
  };

  return (
    <div className="review-card glass-card">
      <div className="review-card__header">
        <div className="review-card__avatar">
          <img
            src={review.avatarUrl || 'https://www.gravatar.com/avatar/placeholder?d=identicon'}
            alt={`${review.username} avatar`}
            loading="lazy"
          />
        </div>
        <div className="review-card__meta">
          <span className="review-card__user">{review.username}</span>
          {editMode ? renderStars(rating, true) : renderStars(Number(review.rating), false)}
          <span className="review-card__date">{review.date}</span>
        </div>
        {isOwner && !editMode && (
          <div className="review-card__actions">
            <button type="button" className="btn btn--secondary btn--small" onClick={() => setEditMode(true)} disabled={submitting}>
              ✎ Edit
            </button>
            <button type="button" className="btn btn--danger btn--small" onClick={handleDelete} disabled={submitting}>
              🗑 Delete
            </button>
          </div>
        )}
      </div>

      {editMode ? (
        <textarea
          className="review-card__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
        />
      ) : (
        <p className="review-card__text">{review.text}</p>
      )}

      {editMode && (
        <div className="review-card__edit-actions">
          <button type="button" className="btn btn--primary" onClick={handleUpdate} disabled={submitting}>
            Save
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => setEditMode(false)} disabled={submitting}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string.isRequired,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.string,
    text: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onRefresh: PropTypes.func.isRequired,
};
