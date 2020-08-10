//This component contains an individual review.  Review details are passed in on this.props.info
import React from 'react';
import ReviewScore from './review_score.jsx';

class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  /*TBD:
  -load default avatar when no user avatar is provided
  -change date to Etsy style (e.g. "Nov 5, 2019")
  -handling for attached images on a review
  */
  render () {
    console.log(this.props.info);
    return (<div>
              <div><img src={this.props.info.customer_avatar} /> {this.props.info.customer_name} {this.props.info.review_date}</div>
              <div><ReviewScore score={this.props.info.review_score}/></div>
              <p>{this.props.info.review_text}</p>
              <p>Purchased item:</p>
              <div><img src={this.props.info.product_thumbnail}/> {this.props.info.product_name}</div>
            </div>);
  }
}

export default Review;