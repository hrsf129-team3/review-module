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

//TBD: create test record(s) for Review
// describe('<Review />', () =>{
//   let wrapper;
//   beforeEach(() => {
//     wrapper = mount(<Review />)
//   });

//   it('should exist', () => {
//     expect(wrapper).toBeDefined();
//   })

// });

//TBD: test varying ReviewScore values
describe('<ReviewScore />', () => {

  it('should exist', () => {
    let wrapper = mount(<ReviewScore score="5"/>);
    expect(wrapper).toBeDefined();
  })

  it('should render five stars', () => {
    let wrapper = render(<ReviewScore score="5"/>);
    expect(wrapper.find('.full-star').length).toEqual(5);
  })

  it('should correctly render half stars', () => {
    let wrapper = render(<ReviewScore score="3.5"/>);
    expect(wrapper.find('.half-star').length).toEqual(1);
  });

  it('should correctly round to the nearest half star', () => {
    let wrapper = render(<ReviewScore score="3.59"/>);
    expect(wrapper.find('.half-star').length).toEqual(1);
    wrapper = render(<ReviewScore score="3.98"/>);
    expect(wrapper.find('.half-star').length).toEqual(0);
  });

  it('should correclty render each possible score from 1 to 5', () => {
    let wrapper = render(<ReviewScore score="1"/>);
    expect(wrapper.find('.full-star').length).toEqual(1);
    expect(wrapper.find('.half-star').length).toEqual(0);
    expect(wrapper.find('.empty-star').length).toEqual(4);

    wrapper = render(<ReviewScore score="1.5"/>);
    expect(wrapper.find('.full-star').length).toEqual(1);
    expect(wrapper.find('.half-star').length).toEqual(1);
    expect(wrapper.find('.empty-star').length).toEqual(3);

    wrapper = render(<ReviewScore score="2"/>);
    expect(wrapper.find('.full-star').length).toEqual(2);
    expect(wrapper.find('.half-star').length).toEqual(0);
    expect(wrapper.find('.empty-star').length).toEqual(3);

    wrapper = render(<ReviewScore score="2.5"/>);
    expect(wrapper.find('.full-star').length).toEqual(2);
    expect(wrapper.find('.half-star').length).toEqual(1);
    expect(wrapper.find('.empty-star').length).toEqual(2);

    wrapper = render(<ReviewScore score="3"/>);
    expect(wrapper.find('.full-star').length).toEqual(3);
    expect(wrapper.find('.half-star').length).toEqual(0);
    expect(wrapper.find('.empty-star').length).toEqual(2);

    wrapper = render(<ReviewScore score="3.5"/>);
    expect(wrapper.find('.full-star').length).toEqual(3);
    expect(wrapper.find('.half-star').length).toEqual(1);
    expect(wrapper.find('.empty-star').length).toEqual(1);

    wrapper = render(<ReviewScore score="4"/>);
    expect(wrapper.find('.full-star').length).toEqual(4);
    expect(wrapper.find('.half-star').length).toEqual(0);
    expect(wrapper.find('.empty-star').length).toEqual(1);

    wrapper = render(<ReviewScore score="4.5"/>);
    expect(wrapper.find('.full-star').length).toEqual(4);
    expect(wrapper.find('.half-star').length).toEqual(1);
    expect(wrapper.find('.empty-star').length).toEqual(0);

    wrapper = render(<ReviewScore score="5"/>);
    expect(wrapper.find('.full-star').length).toEqual(5);
    expect(wrapper.find('.half-star').length).toEqual(0);
    expect(wrapper.find('.empty-star').length).toEqual(0);
  });
});


