import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Review from '../client/src/review.jsx';
import ReviewScore from '../client/src/review_score.jsx';
import ReviewContainer from '../client/src/review_container.jsx';

// component testing
describe('<ReviewContainer />', () => {

  // testing App component
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ReviewContainer />)
  });

  // make sure App renders
  it('should exist', () => {
    expect(wrapper).toBeDefined();
  })

  // make sure App contains RecommendedProducts component
  it('should have <Review /> as a subcomponent', () => {
    expect(wrapper.containsMatchingElement(<Review />)).toEqual(true);
  })

});
