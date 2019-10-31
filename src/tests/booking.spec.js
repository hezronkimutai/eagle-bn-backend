import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import helper from '../utils/helper';
import bookingData from './mockData/reviewBookingData';

chai.use(chaiHttp);
const { expect } = chai;
describe('review accomodation', () => {
  it('it should return 200 and updated review', (done) => {
    chai.request(app)
      .patch('/api/v1/bookings/1/rate')
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send(bookingData[0])
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal('The booking has been rated successfuly');
        expect(res.body.data.rating).to.equal(1);
        done();
      });
  });
  it('it should return 200 and updated review', (done) => {
    chai.request(app)
      .patch('/api/v1/bookings/1/rate')
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send(bookingData[0])
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal('The booking has been rated successfuly');
        expect(res.body.data.rating).to.equal(bookingData[0].rating);
        done();
      });
  });

  it('it should return 400 when bookingId is not integer', (done) => {
    chai.request(app)
      .patch('/api/v1/bookings/jj/rate')
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send(bookingData[0])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('booking id should be integer');
        done();
      });
  });

  it('it should return 404 when  booking not belong to user', (done) => {
    chai.request(app)
      .patch('/api/v1/bookings/1/rate')
      .set('Authorization', helper.createToken(4, 'requester@gmail.com', true, 'requester'))
      .send(bookingData[0])
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.msg).to.equal('You have never booked this accomodation');
        done();
      });
  });
  it('it should return 400 when rating not numeric', (done) => {
    chai.request(app)
      .patch('/api/v1/bookings/1/rate')
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send(bookingData[1])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('rating should be an integer');
        done();
      });
  });
  it('it should return 400 when rating not between 0 and 5', (done) => {
    chai.request(app)
      .patch('/api/v1/bookings/1/rate')
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send(bookingData[2])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('the rating should be between 0 and 5');
        done();
      });
  });
  it('it should return 400 when feedback not provided', (done) => {
    chai.request(app)
      .patch('/api/v1/bookings/1/rate')
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send(bookingData[3])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('feedback is required');
        done();
      });
  });
  it('it should return 200 when the user view the ratings', (done) => {
    chai.request(app)
      .get('/api/v1/accommodations/1/rating')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal('Accommodation rating');
        done();
      });
  });
  it('it should return 404 when there is no rating related to an accommodation', (done) => {
    chai.request(app)
      .get('/api/v1/accommodations/4/rating')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.msg).to.equal('There is no rating for this accommodation');
        done();
      });
  });
  it('it should return 400 when provided id is not numeric', (done) => {
    chai.request(app)
      .get('/api/v1/accommodations/lelel/rating')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
});
