import React from 'react';
import { Star } from 'lucide-react';
import { themeClasses } from '../../../config/theme';

interface ReviewItem {
  id: number;
  rating: number;
  text: string;
  author: string;
}

const reviews: ReviewItem[] = [
  {
    id: 1,
    rating: 5,
    text: "Excellent service! My car looks brand new. Highly recommended!",
    author: "Rahul Sharma",
  },
  {
    id: 2,
    rating: 5,
    text: "Professional team, great attention to detail. Will definitely come back!",
    author: "Priya Patel",
  },
];

const CustomerReviews: React.FC = () => {
  return (
    <div className={themeClasses.sidebar.section}>
      <h3 className={themeClasses.sidebar.heading}>Customer Reviews</h3>
      <div className={themeClasses.sidebar.sectionContent}>
        {reviews.map((review) => (
          <div key={review.id} className={themeClasses.sidebar.reviewCard}>
            <div className="flex items-center mb-2">
              <div className={themeClasses.sidebar.reviewStars}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className={themeClasses.sidebar.reviewStar} />
                ))}
              </div>
              <span className={themeClasses.sidebar.reviewRating}>{review.rating}.0</span>
            </div>
            <p className={themeClasses.sidebar.reviewText}>"{review.text}"</p>
            <p className={themeClasses.sidebar.reviewAuthor}>- {review.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
