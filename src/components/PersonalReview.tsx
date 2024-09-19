import { useState } from 'react';

interface PersonalReviewProps {
  movieId: number;
}

export default function PersonalReview({ movieId }: PersonalReviewProps) {
  const [review, setReview] = useState('');

  const handleSubmitReview = () => {
    // Implement logic to save the review
    console.log(`Submitted review for movie ${movieId}: ${review}`);
    setReview('');
  };

  return (
    <div className="mt-4">
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your personal review..."
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button 
        onClick={handleSubmitReview}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
}