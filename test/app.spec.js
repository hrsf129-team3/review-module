import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Review from '../client/src/review.jsx';
import ReviewScore from '../client/src/review_score.jsx';
import ReviewContainer from '../client/src/review_container.jsx';
import ReviewPagination from '../client/src/review_container.jsx';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import $ from 'jquery';
import { createWaitForElement } from 'enzyme-wait';

//mock Ajax requests for Review module
jest.mock('jquery');

configure({ adapter: new Adapter() });

//test reviews for Review module test
let reviewNoImage = {
  customer_avatar: null,
  customer_name: "Brad78",
  product_name: "Tasty Frozen Hat",
  product_thumbnail: "https://etsydoppleganger.s3-us-west-1.amazonaws.com/product_thumbnail2.jpg",
  review_date: "2020-07-19T07:00:00.000Z",
  review_id: 97,
  review_image: "null",
  review_score: 1,
  review_text: "Ad deleniti iusto. Amet beatae blanditiis officiis tempora. Esse quis quasi culpa ea officia beatae quia iusto nobis. Cumque deleniti ipsam architecto est autem velit et totam.",
  shop_id: 2
};

let reviewWithImage = {
  customer_avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/chadami/128.jpg",
  customer_name: "Davion_Waters",
  product_name: "Rustic Plastic Ball",
  product_thumbnail: "https://etsydoppleganger.s3-us-west-1.amazonaws.com/product_thumbnail4.jpg",
  review_date: "2020-03-12T07:00:00.000Z",
  review_id: 151,
  review_image: "https://etsydoppleganger.s3-us-west-1.amazonaws.com/large_review_image.jpg",
  review_score: 4,
  review_text: "Deleniti qui veniam consequuntur. Excepturi qui ad vero sit. Reiciendis odit quidem. Atque cupiditate rerum ea aut enim ipsam omnis ea.",
  shop_id: 2
};

//populate mock review array for testing
let mockReviewList = [];

for(let i = 0; i < 55; i++) {
  if(i % 2 === 0) {
    mockReviewList.push(reviewNoImage);
  } else {
    mockReviewList.push(reviewWithImage);
  }
}

$.ajax.mockResolvedValue(mockReviewList);

//component testing
//RB's note: I'm not exactly sure how Jest is tracking which lines are being covered by the tests.
//In particular, the review_container coverage report is claiming that getMaxReviews() is not being run/covered,
//even though getMaxReviews() is called during componentDidMount execution and the tests would fail if it were broken.
//Ditto next/previous page function calls, which are marked as being untested/not covered despite being bound as onClick functions
//that are tested below.
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

  it('should have <Review /> as a subcomponent', () =>{
    const waitForRender = createWaitForElement(<Review />);
    waitForRender(wrapper).then(wrapper => expect(wrapper.containsMatchingElement(<Review />)).toEqual(true));
  })

  it('should have <ReviewPagination /> as a subcomponent', () =>{
    const waitForRender = createWaitForElement('.pagination');
    waitForRender(wrapper).then(wrapper => expect(wrapper.containsMatchingElement('.pagination')).toEqual(true));
  })

  it('review count should match number of reviews retrieved from API call', () => {
    const waitForRender = createWaitForElement(<Review />);
    waitForRender(wrapper).then(wrapper => expect(wrapper.state.reviewCount).toEqual(55));
  })

  it('max pages should match expected page count', () => {
    const waitForRender = createWaitForElement(<Review />);
    waitForRender(wrapper).then(wrapper => expect(wrapper.state.maxPage).toEqual(14));
  })

  it('should correctly increment and decrement the current page when clicking the pagination arrows', () => {
    const waitForRender = createWaitForElement('.pagination');
    waitForRender(wrapper).then(wrapper => {
      jest.spyOn(wrapper.nextPage);
      wrapper.find('.right-arrow').simulate('click', { preventDefault() {} });
      expect(wrapper.nextPage).toHaveBeenCalled();
      expect(wrapper.state.currentPage).toEqual(1);
      wrapper.find('.right-arrow').simulate('click', { preventDefault() {} }).simulate('click', { preventDefault() {} });
      expect(wrapper.state.currentPage).toEqual(3);
      wrapper.find('.left-arrow').simulate('click', { preventDefault() {} });
      expect(wrapper.state.currentPage).toEqual(2);
      wrapper.find('.left-arrow').simulate('click', { preventDefault() {} }).simulate('click', { preventDefault() {} }).simulate('click', { preventDefault() {} });
      expect(wrapper.state.currentPage).toEqual(0);
    });
  })

});

//TBD: create test record(s) for Review
describe('<Review />', () =>{
  let wrapperNoImage;
  let wrapperWithImage;
  beforeEach(() => {
    wrapperNoImage = mount(<Review info={reviewNoImage}/>);
    wrapperWithImage = mount(<Review info={reviewWithImage}/>);
  });

  it('should exist', () => {
    expect(wrapperNoImage).toBeDefined();
    expect(wrapperWithImage).toBeDefined();
  })

  it('should have <ReviewScore /> as a subcomponent', () => {
      expect(wrapperNoImage.containsMatchingElement(<ReviewScore />)).toEqual(true);
      expect(wrapperWithImage.containsMatchingElement(<ReviewScore />)).toEqual(true);
  })

  it('should render the review image if one is provided', () => {
    expect(wrapperNoImage.find('img').length).toEqual(2);
    expect(wrapperWithImage.find('img').length).toEqual(3);
  })

});

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

  it('should correctly round to the nearest half for average scores', () => {
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


