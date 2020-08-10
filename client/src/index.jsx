import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Review from './review.jsx';
import ReviewScore from './review_score.jsx';

//set max number of reviews displayed at any one time
const maxReviewsPerPage = 4;

//container for the review module.
class ReviewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewCount: 0,
      currentPage: 0,
      reviews: []
    };

    this.getReviews = this.getReviews.bind(this);
  }

  //get reviews from datbase and save to container state
  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/reviews',
      success: ((response) => {
        this.setState({
          reviews: response
        });
        this.setState({
          reviewCount: this.state.reviews.length
        });
        console.log(this.state.reviewCount);
      }),
      error: ((error)=> {
        console.log(error);
      })
    });
  }

  //Render helper function, generates the HTML for each Review component
  //and returns the completed script.
  getReviews() {
    console.log("Updating reviews for page...");
    let position = this.state.currentPage * maxReviewsPerPage;
    let result = [];
    for(let i = position; i < position + maxReviewsPerPage; i++) {
      result.push(<Review />);
    }

    return result;
  }


  render() {
    let reviews = this.getReviews();
    return (<div>
              {reviews}
            </div>);
  }
}

ReactDOM.render(<ReviewContainer />, document.getElementById('review-app'));

//full star icon
//<svg xmlns="http://www.w3.org/2000/svg" viewBox="3 3 18 18" aria-hidden="true" focusable="false"><path d="M20.83,9.15l-6-.52L12.46,3.08h-.92L9.18,8.63l-6,.52L2.89,10l4.55,4L6.08,19.85l.75.55L12,17.3l5.17,3.1.75-.55L16.56,14l4.55-4Z"></path></svg>