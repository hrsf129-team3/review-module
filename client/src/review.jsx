//This component contains an individual review.  Review details are passed in on this.props.info
import React from 'react';
import ReviewScore from './review_score.jsx';
import styles from './css/review_style.css';

class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  /*TBD:
  -change date to Etsy style (e.g. "Nov 5, 2019")
  -scale image in review (should be 300x300 in review block)
  -create popup when user clicks on review image, with larger review image, review, and purchased product
  */
  render () {
    let avatar = (this.props.info.customer_avatar === null) ? 'https://etsydoppleganger.s3-us-west-1.amazonaws.com/noavatar.jpg' : this.props.info.customer_avatar;
    let fullReview = '';
    if(this.props.info.review_image === "null") {
      fullReview = <div>{this.props.info.review_text}</div>;
    } else {
      //console.log("This review has an image!");
      fullReview = <div>{this.props.info.review_text}<img src={this.props.info.review_image}/></div>
    }
    //console.log(this.props.info);
    return (<div>
              <div className={styles.r1}><img src={avatar} className={styles.avatar}/> {this.props.info.customer_name} {this.props.info.review_date}</div>
              <div className={styles.r2}>
                <div><ReviewScore score={this.props.info.review_score}/></div>
                {fullReview}
                <p>Purchased item:</p>
                <div><img src={this.props.info.product_thumbnail}/> {this.props.info.product_name}</div>
              </div>
            </div>);
  }
}

export default Review;