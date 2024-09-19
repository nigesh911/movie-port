import mongoose from 'mongoose';

const WatchedMovieSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  poster_path: { type: String },
  review: { type: String },
  watchedAt: { type: Date, default: Date.now }
});

export default mongoose.models.WatchedMovie || mongoose.model('WatchedMovie', WatchedMovieSchema);