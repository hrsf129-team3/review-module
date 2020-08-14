//This component contains an individual review.  Review details are passed in on this.props.info
import React from 'react';
import ReviewScore from './review_score.jsx';
import moment from 'moment';
import styles from './css/review_style.css';

class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  /*TBD:
  -scale image in review
  -create popup when user clicks on review image, with larger review image, review, and purchased product
  */
  render () {
    let avatar = (this.props.info.customer_avatar === null) ? 'https://etsydoppleganger.s3-us-west-1.amazonaws.com/noavatar.jpg' : this.props.info.customer_avatar;
    let fullReview = '';
    let formatDate = moment(this.props.info.review_date, 'YYYY-MM-DD').format('MMM D, YYYY');
    if(this.props.info.review_image === "null") {
      fullReview = <div>{this.props.info.review_text}</div>;
    } else {
      //console.log("This review has an image!");
      fullReview = <div>{this.props.info.review_text}<img src={this.props.info.review_image} className={styles.reviewimage}/></div>
    }
    //console.log(this.props.info);
    return (<div className={styles.r0}>
              <div className={styles.r1}><img src={avatar} className={styles.avatar}/> <a href="#">{this.props.info.customer_name}</a>&nbsp;{formatDate}</div>
              <div className={styles.r2}>
                <div className={styles.r3}><div className={styles.rating}><ReviewScore score={this.props.info.review_score}/></div>
                  <div>{fullReview}</div>
                </div>
                <p className={styles.smallText}>Purchased item:</p>
                <div className={styles.product}><img src={this.props.info.product_thumbnail} className={styles.thumbnail}/> <a href="#" className={styles.smallText}>{this.props.info.product_name}</a></div>
              </div>
            </div>);
  }
}

export default Review;