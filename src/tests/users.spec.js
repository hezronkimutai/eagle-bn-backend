import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import data from './mockData/email';
import helpers from '../utils/helper';

chai.use(chaiHttp);
chai.should();
describe('Password Reset', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(data.user1)
      .end(() => done());
  });
  it('Should update user profile', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ city: 'kampala' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.have.property('city').eql('kampala');
        res.body.should.have.property('msg').eql('Profile updated successfully');
        done();
      });
  });
  it('Should update user profile', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ city: 'kampala' })
      .attach('avatar', 'src/tests/mockData/img.png')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.have.property('city').eql('kampala');
        res.body.should.have.property('msg').eql('Profile updated successfully');
        done();
      });
  });
  it('Should throw error when image source not found', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Content-Type', 'multipart/form-data')
      .field({ city: 'kampala' })
      .attach('avatar', 'src/tests/mockData/img.png')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('msg').eql('provide token to get access');
        done();
      });
  });
  it('Should test an invalid token', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', '44')
      .set('Content-Type', 'multipart/form-data')
      .field({ city: 'kampala' })
      .attach('avatar', 'src/tests/mockData/img.png')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('jwt malformed');
        done();
      });
  });
  it('Should test for invalid image upload', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ city: 'kampala' })
      .attach('avatar', 'src/tests/mockData/img.mp3')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('avatar image fomart is invalid');
        done();
      });
  });
  it('Should test for password match', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ password: 'english12@@', comfirmPassword: 'english12@' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('password provided do not match');
        done();
      });
  });
  it('Should test an invalid password', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ password: 'english12', comfirmPassword: 'english12' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('password should have 1 special character and alphanumeric');
        done();
      });
  });
  it('Should test for city', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ city: '123' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('city should be alphabetic and have 2 character minimum');
        done();
      });
  });
  it('Should test for gender', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ gender: '123' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('gender is invalid');
        done();
      });
  });
  it('Should test for invalid gender', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ gender: '123' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('gender is invalid');
        done();
      });
  });
  it('Should test address length', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ address: '?' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('address length should be greater than 1');
        done();
      });
  });
  it('Should test for alphanumeric value', (done) => {
    chai.request(app)
      .patch('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .set('Content-Type', 'multipart/form-data')
      .field({ fullname: '?' })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('fullname should be alphanumeric');
        done();
      });
  });
  it('Should test for alphanumeric value', (done) => {
    chai.request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('my profile');
        done();
      });
  });
  it('Should test for alphanumeric value', (done) => {
    chai.request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(1, 'rswaib@gmail.com'))
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('my profile');
        done();
      });
  });
  it('Should return 200 when a user is unscbribed to emails', (done) => {
    chai.request(app)
      .get(`/api/v1/users/email/unsubscribe/${helpers.createToken(1, 'requester@gmail.com')}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('logout functionality', () => {
  it('check for successfull logout', (done) => {
    chai.request(app)
      .patch('/api/v1/users/logout')
      .set('Authorization', helpers.createToken(3, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Logout successful');
        done();
      });
  });
  it('Should test for alphanumeric value', (done) => {
    chai.request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', helpers.createToken(3, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('You need to login first');
        done();
      });
  });

  it('should return a 401 when you are not owner of the request or manager', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/comments/1')
      .send({ comment: 'new Comment' })
      .set('Authorization', helpers.createToken(3, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('You need to login first');
        done();
      });
  });
});
