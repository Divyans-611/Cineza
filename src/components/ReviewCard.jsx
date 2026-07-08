// src/components/ReviewCard.jsx
import { useState } from 'react';
import * as reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

export default function ReviewCard({ review, onRefresh }) {
  const { user, token } = useAuth();
  // Backend populates user as object with _id; review.user._id or review.user may be string
  const reviewUserId = review.user?._id || review.user;
  const isOwner = user && (
    review.username === user.username ||
    String(reviewUserId) === String(user.id || user._id)
  );
  const [editMode, setEditMode] = useState(false);
  const [rating, setRating] = useState(Number(review.rating));
  // Backend field is 'review', not 'text'
  const [text, setText] = useState(review.review || review.text || '');
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      await reviewService.deleteReview(review._id || review.id, token);
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
      // Backend field for review text is 'review', not 'text'
      await reviewService.updateReview(review._id || review.id, { rating, review: text }, token);
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

  // Format date from createdAt if no date field
  const displayDate = review.date ||
    (review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '');

  // Display name: from populated user.name or review.username
  const displayUsername = review.username || review.user?.name || 'Anonymous';

  return (
    <div className="review-card glass-card">
      <div className="review-card__header">
        <div className="review-card__avatar">
          <img
            src={review.user?.avatar || review.avatarUrl || `https://www.gravatar.com/avatar/${displayUsername}?d=identicon`}
            alt={`${displayUsername} avatar`}
            loading="lazy"
          />
        </div>
        <div className="review-card__meta">
          <span className="review-card__user">{displayUsername}</span>
          {editMode ? renderStars(rating, true) : renderStars(Number(review.rating), false)}
          <span className="review-card__date">{displayDate}</span>
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
        <p className="review-card__text">{review.review || review.text}</p>
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
    _id: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.string,
    review: PropTypes.string,
    text: PropTypes.string,
    avatarUrl: PropTypes.string,
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  onRefresh: PropTypes.func.isRequired,
};
