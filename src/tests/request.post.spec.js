import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '..';
import helper from '../utils/helper';
import requests from './mockData/request';

chai.use(chaiHttp);
const { expect } = chai;

describe('create request and new request notifications', () => {
  it('create request, should return a 201 status', (done) => {
    chai.request(app)
      .post('/api/v1/requests/')
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send(requests[0])
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });
  it('create request and remember personal data, should return a 201 status', (done) => {
    chai.request(app)
      .post('/api/v1/requests/')
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester', true))
      .send(requests[0])
      .end((err, res) => {
        expect(res.status).to.equal(201);
        done();
      });
  });
  it('should return a 400 status when timeZone is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/requests/')
      .send(requests[1])
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should return a 400 status when user is not verified', (done) => {
    chai.request(app)
      .post('/api/v1/requests/')
      .send(requests[2])
      .set('Authorization', helper.createToken(3, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should return a 200 status when manager is getting notifications', (done) => {
    chai.request(app)
      .get('/api/v1/notifications')
      .set('Authorization', helper.createToken(5, 'manager@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should return a 401 status when manager is not the owner of the notification', (done) => {
    chai.request(app)
      .get('/api/v1/notifications/1')
      .set('Authorization', helper.createToken(3, 'manager@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
  it('should return a 200 by getting single notification', (done) => {
    chai.request(app)
      .get('/api/v1/notifications/1')
      .set('Authorization', helper.createToken(5, 'manager@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should return a 200 status when notification is updated to read', (done) => {
    chai.request(app)
      .patch('/api/v1/notifications/1/read')
      .set('Authorization', helper.createToken(5, 'manager@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should return a 404 status when notification is not found', (done) => {
    chai.request(app)
      .get('/api/v1/notifications/op')
      .set('Authorization', helper.createToken(5, 'manager@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});

describe('PATCH /notifications/all', () => {
  it('should return a 201 status when all notification are marked as read', (done) => {
    chai.request(app)
      .patch('/api/v1/notifications/readall')
      .set('Authorization', helper.createToken(5, 'manager@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
