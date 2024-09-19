import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);