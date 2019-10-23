import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '..';
import helper from '../utils/helper';

chai.use(chaiHttp);
const { expect } = chai;

describe('get requests test', () => {
  it('get all requests, should return a 200 status', (done) => {
    chai.request(app)
      .get('/api/v1/requests/')
      .set('Authorization', helper.createToken(2, 'alexismajyambere@gmail.com', true))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal('Requests');
        expect(res.body.data.length).to.equal(2);
        done();
      });
  });
  it('should return a 401 status when token is invalid', (done) => {
    chai.request(app)
      .get('/api/v1/requests/')
      .set('Authorization', 'wefhkwefkwjebfkjewfkj')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.msg).to.equal('Invalid Token');
        done();
      });
  });
  it('should return a 400 status when user is not verified', (done) => {
    chai.request(app)
      .get('/api/v1/requests/')
      .set('Authorization', helper.createToken(1, 'alexis@gmail.com', false))
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('The user is not verified');
        done();
      });
  });
});
