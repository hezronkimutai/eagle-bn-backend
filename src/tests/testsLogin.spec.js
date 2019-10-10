import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import myserver from '../index';
import mock from './mockData/loginMockData';

chai.use(chaiHttp);
const { expect } = chai;

describe('login', () => {
  it('It should return a 201 status, a token and user-data when logged in', (done) => {
    chai.request(myserver)
      .post('/api/v1/users/login')
      .send(mock[0])
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('msg');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.data.email).to.equal(mock[0].email);
        expect(res.body.data).to.have.property('token');
        done();
      });
  });
  it('It should return a 400 status, when password is invaid', (done) => {
    chai.request(myserver)
      .post('/api/v1/users/login')
      .send(mock[1])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('msg');
        expect(res.body).to.have.property('status');
        expect(res.body.msg).to.equal('The email and/or password is invalid');
        done();
      });
  });
  it('It should return a 400 status, when email is invaid', (done) => {
    chai.request(myserver)
      .post('/api/v1/users/login')
      .send(mock[2])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('The email and/or password is invalid');
        done();
      });
  });
  it('It should return a 400 status, when email is not provided', (done) => {
    chai.request(myserver)
      .post('/api/v1/users/login')
      .send(mock[3])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('Both email and password are required');
        done();
      });
  });
  it('It should return a 400 status, when password is not provided', (done) => {
    chai.request(myserver)
      .post('/api/v1/users/login')
      .send(mock[4])
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('Both email and password are required');
        done();
      });
  });
});
