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
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.firstPage= this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
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

  //onclick handler: should decrement currentPage
  previousPage() {
    if(this.state.currentPage > 0) {
      this.setState({
        currentPage: this.state.currentPage - 1
      });
    };
  }

  //onclick handler: should increment currentPage
  nextPage(){
    if(this.state.currentPage + 1 < this.state.maxPage) {
      this.setState({
        currentPage: this.state.currentPage + 1
      });
    }
  }

  //onClick handler: switch to first page
  firstPage(){
    if(this.state.currentPage != 0) {
      this.setState({
        currentPage: 0
      });
    }
  }

  //onClick handler: switch to last page
  lastPage(){
    if(this.state.currentPage != this.state.maxPage -1) {
      this.setState({
        currentPage: this.state.maxPage - 1
      });
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
              <ReviewPagination currentPage={oneCurrentPage} maxPage={this.state.maxPage} previous={this.previousPage} next={this.nextPage} first={this.firstPage} last={this.lastPage}/>
            </div>);
  }
}


//arrow SVGs for Pagination
const rightArrow = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="18" width="18">
<path d="M17.3 12.7l.7-.7-.7-.7-4-4c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l2.3 2.3H7c-.6 0-1 .4-1 1s.4 1 1 1h7.2l-2.3 2.3c-.2.2-.3.4-.3.7 0 .6.4 1 1 1 .3 0 .5-.1.7-.3l4-4z"></path>
</svg>);

const leftArrow = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="18" width="18">
<path d="M6.7 11.3L6 12l.7.7 4 4c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L9.8 13H17c.6 0 1-.4 1-1s-.4-1-1-1H9.8l2.3-2.3c.2-.2.3-.4.3-.7 0-.6-.4-1-1-1-.3 0-.5.1-.7.3l-4 4z"></path>
</svg>);


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

  //render helper to create page numbers
  getPages() {
    let results = [];
    //render first page, then conditionally render from here
    results.push(<span onClick={this.props.first}>1</span>);
    //if current page is 1 or 2, add a 2 to the page list
    if(this.props.currentPage <= 2) {
      results.push(<span>2</span>);
    }
    //if current page is greater than two (and max page count is also greater than 2), add an ellipsis
    if(this.props.currentPage > 2 && this.props.maxPage > 2) {
      results.push(<span>...</span>);
    }
    //if current page is not the last/second to last page, add the current page number to the page list.
    //also, add another ellipsis while we're here
    if(this.props.currentPage < this.props.maxPage -1 && this.props.currentPage > 2) {
      results.push(<span>{this.props.currentPage}</span>);
    }
    if(this.props.currentPage < this.props.maxPage - 1) {
      results.push(<span>...</span>);
    }
    //if current page is second to last or last, add it to page list
    if(this.props.currentPage >= this.props.maxPage - 1) {
      results.push(<span>{this.props.maxPage - 1}</span>);
    }
    //finally, draw the last page number if there is more than one page
    if(this.props.maxPage !== 1) {
      results.push(<span onClick={this.props.last}>{this.props.maxPage}</span>)
    }

    return results;
  }


  render() {
    let pages = this.getPages();
    return (<div><span onClick={this.props.previous}>{leftArrow}</span>{pages}<span onClick={this.props.next}>{rightArrow}</span></div>);
  }
}

export default ReviewContainer;

