import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  shareableId: { type: String, unique: true },
  watchedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WatchedMovie' }]
});

UserSchema.pre('save', function(next) {
  if (!this.shareableId) {
    this.shareableId = crypto.randomBytes(6).toString('hex');
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);