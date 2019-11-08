import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import likingData from './mockData/likingData';
import helper from '../utils/helper';

chai.use(chaiHttp);
const { expect } = chai;
describe('Like/Unlike an accomodation facility', () => {
  it('it should return 401 status and not logged in', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations/1/like')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
  it('it should return 201 status and create a like', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations/1/like')
      .set('Authorization', helper.createToken(2, 'requester@gmail.com', true, 'requester'))
      .send(likingData[2])
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });
  it('it should return 200 status and create a like', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations/1/like')
      .set('Authorization', helper.createToken(2, 'requester@gmail.com', true, 'requester'))
      .send(likingData[2])
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('it should return 200 and update the like status from false to true', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations/1/like')
      .set('Authorization', helper.createToken(1, 'requester@gmail.com', true, 'requester'))
      .send(likingData[0])
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('it should return 200 and update the like status from true to false', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations/1/like')
      .set('Authorization', helper.createToken(1, 'requester@gmail.com', true, 'requester'))
      .send(likingData[1])
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('it should return 400  when an invalid parameter is passed', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations/ooogg/like')
      .set('Authorization', helper.createToken(2, 'requester@gmail.com', true, 'requester'))
      .send(likingData[2])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('Wrong accommodation ID sent');
        done();
      });
  });
  it('it should return 200  and count the unlikes and likes of the accommodation', (done) => {
    chai.request(app)
      .get('/api/v1/accommodations/2/like')
      .set('Authorization', helper.createToken(2, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('it should return 400 status when wront accommodation sumber is sent', (done) => {
    chai.request(app)
      .get('/api/v1/accommodations/dgsd/like')
      .set('Authorization', helper.createToken(2, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
});
