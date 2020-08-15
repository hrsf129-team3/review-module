import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Review from './review.jsx';
import ReviewScore from './review_score.jsx';
import styles from './css/review_container_style.css';

//set max number of reviews displayed at any one time
const maxReviewsPerPage = 4;

const dummyCarousel='https://etsydoppleganger.s3-us-west-1.amazonaws.com/dummycarousel.jpeg';

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

    this.reviewsByRecommended = this.reviewsByRecommended.bind(this);
    this.reviewsByNewest = this.reviewsByNewest.bind(this);
    this.getReviews = this.getReviews.bind(this);
    this.getAverageScore = this.getAverageScore.bind(this);
    this.getMaxPages = this.getMaxPages.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.firstPage= this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.toPage = this.toPage.bind(this);
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

  //helper functions to download reviews: should be passed to dropdown element
  reviewsByRecommended() {
    console.log("Sorting reviews by recommended...");
    $.ajax({
      method: 'GET',
      url: '/reviews',
      success: ((response) => {
        this.setState({
          reviews: response,
          currentPage: 0
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

  reviewsByNewest() {
    console.log("Sorting reviews by newest...");
    $.ajax({
      method: 'GET',
      url: '/newest',
      success: ((response) => {
        this.setState({
          reviews: response,
          currentPage: 0
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
    if(this.state.currentPage !== 0) {
      this.setState({
        currentPage: 0
      });
    }
  }

  //onClick handler: switch to last page
  lastPage(){
    if(this.state.currentPage !== this.state.maxPage -1) {
      this.setState({
        currentPage: this.state.maxPage - 1
      });
    }
  }

  //onClick handler: switch to page listed in target event
  toPage(event){
    let page = parseInt(event.target.innerHTML, 10);
    if(this.state.currentPage + 1 !== page) {
      this.setState({
        currentPage: page - 1
      });
    }
  }

  /*TBD:
  -Add Sort By dropdown menu for Recommended and Newest
  -Dummy carousel should scale to the width of the component
  -CSS styling
  -Fade in/out animation when switching between pages
  */
  render() {
    let oneCurrentPage = this.state.currentPage + 1;
    let reviews = this.getReviews();
    //let dropdown = <button>Sort By Placeholder</button>;
    return (<div className={styles.container}>
              <div className={styles.header}>
                <div className={styles.reviewSummary}>{this.state.reviewCount} shop reviews <ReviewScore score={this.state.averageScore} className={styles.headerRating}/></div>
                <Dropdown recommended={this.reviewsByRecommended} newest={this.reviewsByNewest}/>
              </div>
              {reviews}
              <ReviewPagination className="pagination" currentPage={oneCurrentPage} maxPage={this.state.maxPage} previous={this.previousPage} next={this.nextPage} first={this.firstPage} last={this.lastPage} to={this.toPage}/>
              <div className={styles.fromReviews}>Photos from reviews</div>
              <img src={dummyCarousel} className={styles.dummyCarousel}/>
            </div>);
  }
}


//arrow SVGs for Pagination
const rightArrow = (<svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="18" width="18">
<path d="M17.3 12.7l.7-.7-.7-.7-4-4c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l2.3 2.3H7c-.6 0-1 .4-1 1s.4 1 1 1h7.2l-2.3 2.3c-.2.2-.3.4-.3.7 0 .6.4 1 1 1 .3 0 .5-.1.7-.3l4-4z"></path>
</svg>);

const leftArrow = (<svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="18" width="18">
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
    results.push(<span onClick={this.props.first} className={styles.pageButton}>1</span>);
    //if current page is 1 or 2, add a 2 to the page list
    if(this.props.currentPage <= 2) {
      results.push(<span onClick={this.props.to} className={styles.pageButton}>2</span>);
    }
    //if current page is greater than two (and max page count is also greater than 2), add an ellipsis
    if(this.props.currentPage > 2 && this.props.maxPage > 2) {
      results.push(<span className={styles.ellipses}>...</span>);
    }
    //if current page is not the last/second to last page, add the current page number to the page list.
    //also, add another ellipsis while we're here
    if(this.props.currentPage < this.props.maxPage -1 && this.props.currentPage > 2) {
      results.push(<span className={styles.pageButton}>{this.props.currentPage}</span>);
    }
    if(this.props.currentPage < this.props.maxPage - 1) {
      results.push(<span className={styles.ellipses}>...</span>);
    }
    //if current page is second to last or last, add it to page list
    if(this.props.currentPage >= this.props.maxPage - 1) {
      results.push(<span onClick={this.props.to} className={styles.pageButton}>{this.props.maxPage - 1}</span>);
    }
    //finally, draw the last page number if there is more than one page
    if(this.props.maxPage > 2) {
      results.push(<span onClick={this.props.last} className={styles.pageButton}>{this.props.maxPage}</span>)
    }

    return results;
  }


  render() {
    let pages = this.getPages();
    return (<div className={styles.pagination}><span onClick={this.props.previous} className={styles.pageArrow}>{leftArrow}</span>{pages}<span onClick={this.props.next} className={styles.pageArrow}>{rightArrow}</span></div>);
  }
}

//arrow for dropdown menu
const dropdownArrow = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="24" width="24" className={styles.dropdownArrow}><polygon points="16.5 10 12 16 7.5 10 16.5 10"></polygon></svg>)

//dropdown menu sorts reviews by either Recommended or Newest.
//Functions to sort reviews should come in on this.props.recommended or this.props.newest
class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'Recommended'
    };
    this.getRecommended = this.getRecommended.bind(this);
    this.getNewest = this.getNewest.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  //helper function for dropdown: gets reviews sorted by "recommeneded"
  getRecommended() {
    this.props.recommended();
    let dropdownTop = document.getElementById('dropdown-top-text');

    dropdownTop.innerHTML = "Sort By: Recommended";
    this.toggleDropdown();
  }

  //helper function for dropdown: gets reviews sorted by most recent date
  getNewest () {
    this.props.newest();
    let dropdownTop = document.getElementById('dropdown-top-text');
    dropdownTop.innerHTML ="Sort By: Newest";
    this.toggleDropdown();
  }

  toggleDropdown() {
    let menu = document.getElementById('dropdown-items');
    let dropdownTop = document.getElementById('dropdown-top');
    if(menu.style.display === "block") {
      menu.style.display = "none";
      dropdownTop.style.borderRadius = "24px";
    } else {
      menu.style.display = "block";
      dropdownTop.style.borderTopLeftRadius = "12px";
      dropdownTop.style.borderTopRightRadius = "12px";
      dropdownTop.style.borderBottomLeftRadius = "0px";
      dropdownTop.style.borderBottomRightRadius = "0px";
    }
  }

  //helper function that always sets dropdown to its closed state.
  //should be used with a listener that checks to see if a user clicks outside of the menu
  closeDropdown() {
    let menu = document.getElementById('dropdown-items');
    let dropdownTop = document.getElementById('dropdown-top');

    menu.style.display = "none";
    dropdownTop.style.borderRadius = "24px";
  }

  render () {
    return (<div className={styles.dropdown}>
              <div className={styles.dropdownContainer} id="dropdown-container">
                <span onClick={this.toggleDropdown} className={styles.dropdownTop} id="dropdown-top"><span id="dropdown-top-text">Sort By: Recommended</span> {dropdownArrow}</span>
                  <div className={styles.dropdownOptions} id="dropdown-items">
                    <span className={styles.optionrec} id="recommended" onClick={this.getRecommended}>Recommended</span>
                    <span className={styles.optionnew} id="newest" onClick={this.getNewest}>Newest</span>
                  </div>
              </div>
            </div>);
  }
}

export default ReviewContainer;
