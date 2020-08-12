import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Review from '../client/src/review.jsx';
import ReviewScore from '../client/src/review_score.jsx';
import ReviewContainer from '../client/src/review_container.jsx';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// component testing
describe('<ReviewContainer />', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = mount(<ReviewContainer />)
  });

  it('should exist', () => {
    expect(wrapper).toBeDefined();
  })

  it('should have <ReviewScore /> as a subcomponent', () => {
    expect(wrapper.containsMatchingElement(<ReviewScore />)).toEqual(true);
  })


});
