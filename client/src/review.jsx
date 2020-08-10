//This component contains an individual review.
import React from 'react';
import ReviewScore from './review_score.jsx';

class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (<div>
              <ReviewScore />
              <h3>This is a review.</h3>
            </div>);
  }
}

export default Review;