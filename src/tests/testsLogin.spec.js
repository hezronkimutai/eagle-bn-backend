import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { describe, it } from 'mocha';
import User from '../controllers/users.controller';
import OAuthCallback from '../utils/OAuthCallback';
import myserver from '../index';
import mock from './mockData/loginMockData';
import google from './mockData/profile';

chai.use(chaiHttp);
chai.use(sinonChai);
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

describe('Oauthentication CallBack', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('Should return status 201', async () => {
    const req = {
      user: {
        fullname: 'Crispy N. Christian',
        email: 'crispy@mail.com',
        isverified: true
      }
    };

    const res = { status() {}, json() {}, };
    sinon.stub(res, 'status').returnsThis();
    await User.OauthLogin(req, res);
    expect(res.status).to.have.been.calledWith(201);
  });

  it('OAuthCallback should return User object', async (done) => {
    const accessToken = 'xx-xx-xx';
    const refreshToken = 'xx-xx-xx';
    const cb = sinon.spy();
    OAuthCallback(accessToken, refreshToken, google, cb);
    expect(cb.withArgs({
      fullname: 'Crispy N. Christian',
      email: 'nshimyumukizachristian@gmail.com',
      isverified: true
    }));
    done();
  });
});
