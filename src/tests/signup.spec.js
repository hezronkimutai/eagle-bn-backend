import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import mockData from './mockData/signupMockupData';

chai.use(chaiHttp);
const { expect } = chai;

describe('signup', () => {
  it('should return a 201 status, a jwt token and user data when', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[0])
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.msg).to.equal('Account created successfully');
        expect(res.body.data.email).to.equal(mockData[0].email);
        expect(res.body.data).to.have.property('token');
        done();
      });
  });
  it('should return a 409 status and error message', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[0])
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.body.msg).to.equal('This email already exists');
        done();
      });
  });
  it('should return a 400 status when email not sent', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[1])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('email is required');
        done();
      });
  });
  it('should return a 400 status when username not sent', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[2])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('username is required');
        done();
      });
  });
  it('should return a 400 status when password lenght less than 8', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[3])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('password length should be greater than 7');
        done();
      });
  });
  it('should return a 400 status when password is not alphanumeric', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[4])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('password should be alphanumeric');
        done();
      });
  });
  it('should return a 400 status when  wrong email sent', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[5])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('Invalid email address');
        done();
      });
  });
  it('should return a 400 status when confirmPassword  is not sent', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[6])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('confirmPassword is required');
        done();
      });
  });
  it('should return a 400 status when confirmPassword and password don\'t match sent', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[7])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('passwords do not match');
        done();
      });
  });
  it('should return a 400 status when password lenght is less than 2', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(mockData[8])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('username should be alphabetic and have 2 character minimum');
        done();
      });
  });
});
