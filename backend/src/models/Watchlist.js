import mongoose from 'mongoose'

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
      default: '',
    },
    backdropPath: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
    overview: {
      type: String,
      default: '',
    },
    genres: {
      type: [String],
      default: [],
    },
    mediaType: {
      type: String,
      enum: ['movie', 'tv'],
      default: 'movie',
    },
    status: {
      type: String,
      enum: ['want_to_watch', 'watching', 'watched'],
      default: 'want_to_watch',
    },
    notes: {
      type: String,
      default: '',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate media for the same user
watchlistSchema.index({ user: 1, movieId: 1, mediaType: 1 }, { unique: true })

const Watchlist = mongoose.model('Watchlist', watchlistSchema)

export default Watchlist
