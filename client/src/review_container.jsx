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
      maxPage: 0,
      reviews: [],
      averageScore: 0
    };

    this.getReviews = this.getReviews.bind(this);
    this.getAverageScore = this.getAverageScore.bind(this);
    this.getMaxPages = this.getMaxPages.bind(this);
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
          reviewCount: this.state.reviews.length,
          averageScore: this.getAverageScore(),
          maxPage: this.getMaxPages(this.state.reviews.length)
        });
        console.log(this.state.reviewCount);
      }),
      error: ((error)=> {
        console.log(error);
      })
    });
  }

  //componentDidMount helper function: calculates the average score of all reviews
  //stored in state
  getAverageScore() {
    let total = 0;
    for(let i = 0; i < this.state.reviews.length; i++) {
      total += this.state.reviews[i].review_score;
    }
    return (total / this.state.reviews.length);
  }

  //Render helper function, generates the HTML for each Review component
  //and returns the completed script.
  getReviews() {
    console.log("Updating reviews for page...");
    let position = this.state.currentPage * maxReviewsPerPage;
    let endPosition = (position + maxReviewsPerPage > this.state.reviews.length) ? this.state.reviews.length : position + maxReviewsPerPage;
    let result = [];
    for(let i = position; i < endPosition; i++) {
      result.push(<Review info={this.state.reviews[i]}/>);
    }

    return result;
  }

  //helper function to calculate max number of pages
  getMaxPages(reviews) {
    if(reviews % maxReviewsPerPage === 0) {
      return reviews / maxReviewsPerPage;
    } else {
      return Math.floor(reviews / maxReviewsPerPage) + 1;
    }
  }


  /*TBD:
  -Add Sort By dropdown menu
  -Page selector at bottom of container
  -Placeholder image for image carousel
  -CSS styling
  -Fade in/out animation when switching between pages
  */
  render() {
    let oneCurrentPage = this.state.currentPage + 1;
    let reviews = this.getReviews();
    return (<div>
              <span>{this.state.reviewCount} shop reviews <ReviewScore score={this.state.averageScore}/></span>
              {reviews}
              <ReviewPagination currentPage={oneCurrentPage} maxPage={this.state.maxPage} />
            </div>);
  }
}

//page counter class for Review container module
//Etsy pagination looks like the following:
// (<-) (pages) (->)
//arrows select previous or next page, respectively
//first and last page is always listed between the arrows.  Clicking these takes the user to the first or last page of reviews.
//if on the first/second page, pages are rendered like so:
// (<-) (1) (2) ... (last) (->)
//last/second to last are handled similarly.  For all other page numbers:
//(<-) (1) ... (n) ... (last) (->)
//class should receive current and max pages from parent, along with functions to change between pages
class ReviewPagination extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (<div>Page {this.props.currentPage} of {this.props.maxPage}</div>);
  }
}

export default ReviewContainer;

