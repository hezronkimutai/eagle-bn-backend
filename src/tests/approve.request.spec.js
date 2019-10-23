import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import helpers from '../utils/helper';

chai.use(chaiHttp);
const { expect } = chai;

describe('approve/reject request', () => {
  it('it should return 200 and updated request data', (done) => {
    chai.request(app)
      .patch('/api/v1/requests/1/approve')
      .set('Authorization', helpers.createToken(5, 'admin@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.status).to.equal('approved');
        done();
      });
  });
  it('should return a 200 status and request list', (done) => {
    chai.request(app)
      .get('/api/v1/requests/managers/5')
      .set('Authorization', helpers.createToken(5, 'alexis@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.length).to.equal(2);
        done();
      });
  });
  it('should return a 200 status and request list', (done) => {
    chai.request(app)
      .get('/api/v1/requests/managers/5?status=pending')
      .set('Authorization', helpers.createToken(5, 'alexis@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.length).to.equal(1);
        done();
      });
  });
  it('should return a 401 status  when getting another manager requests', (done) => {
    chai.request(app)
      .get('/api/v1/requests/managers/1?status=pending')
      .set('Authorization', helpers.createToken(2, 'alexis@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.msg).to.equal('you are not authorized');
        done();
      });
  });

  it('it should return 401 when user not manager', (done) => {
    chai.request(app)
      .patch('/api/v1/requests/2/approve')
      .set('Authorization', helpers.createToken(5, 'admin@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.msg).to.equal('you are not authorized');
        done();
      });
  });
  it('it should return 401 when request does not belong to lineManager', (done) => {
    chai.request(app)
      .patch('/api/v1/requests/2/approve')
      .set('Authorization', helpers.createToken(3, 'admin@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.msg).to.equal('you are not managing this request');
        done();
      });
  });
  it('it should return 200 and updated request data', (done) => {
    chai.request(app)
      .patch('/api/v1/requests/2/reject')
      .set('Authorization', helpers.createToken(5, 'admin@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.status).to.equal('rejected');
        done();
      });
  });
  it('it should return 403 when request not pending', (done) => {
    chai.request(app)
      .patch('/api/v1/requests/2/reject')
      .set('Authorization', helpers.createToken(5, 'admin@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.msg).to.equal('this request is already approved/rejected');
        done();
      });
  });
  it('it should return 400 when invalid route is provided', (done) => {
    chai.request(app)
      .patch('/api/v1/requests/2/lllelele')
      .set('Authorization', helpers.createToken(5, 'admin@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('invalid request');
        done();
      });
  });
  it('it should return 404 when request does not exist', (done) => {
    chai.request(app)
      .patch('/api/v1/requests/900/approve')
      .set('Authorization', helpers.createToken(5, 'admin@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.msg).to.equal('no request with such an id');
        done();
      });
  });
});
