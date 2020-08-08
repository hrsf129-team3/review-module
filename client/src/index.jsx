import React from 'react';
import ReactDOM from 'react-dom';

class ReviewContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<h1>Test.</h1>);
  }
}

ReactDOM.render(<ReviewContainer />, document.getElementById('review-app'));