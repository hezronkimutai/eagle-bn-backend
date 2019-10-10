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
  it('Should send reset instructions', (done) => {
    chai.request(app)
      .post('/api/v1/users/reset-password')
      .send({ email: 'rswaib@gmail.com' })
      .end((err, res) => {
        res.body.should.have.property('msg').eql('password reset instructions sent to rswaib@gmail.com');
        done();
      });
  });
  it('Should succesfully reset tyhe passwword', (done) => {
    chai.request(app)
      .patch(`/api/v1/users/reset-password/${helpers.createToken(1, 'rswaib@gmail.com',)}`)
      .send(data.user1)
      .end((err, res) => {
        res.body.should.have.property('msg').eql('password updated successfully');
        done();
      });
  });
  it('Should check if password donot match', (done) => {
    chai.request(app)
      .patch(`/api/v1/users/reset-password/${helpers.createToken(1, 'rswaib@gmail.com',)}`)
      .send(data.user2)
      .end((err, res) => {
        res.body.should.have.property('msg').eql('Password provided do not match');
        done();
      });
  });
  it('Should test an invalid token', (done) => {
    chai.request(app)
      .patch('/api/v1/users/reset-password/44')
      .send(data.user1)
      .end((err, res) => {
        res.body.should.have.property('msg').eql('jwt malformed');
        done();
      });
  });
});
