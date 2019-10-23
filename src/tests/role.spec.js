import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import helper from '../utils/helper';

chai.use(chaiHttp);
chai.should();

describe('PUT /users/role', () => {
  it('should return error when there is a missing fields', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .send({ email: 'rswaib@gmail.com' })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.an('object');
        res.should.have.property('status').eql(400);
        done();
      });
  });

  it('should return error when the role does not exist', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .send({ email: 'rswaib@gmail.com', new_role: 'dlknfs' })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.an('object');
        res.should.have.property('status').eql(400);
        done();
      });
  });

  it('should return error when there is no token', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .send({ email: 'rswhhraib@gmail.com', new_role: 'admin' })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.an('object');
        res.should.have.property('status').eql(401);
        done();
      });
  });

  it('should return error when user does not exist', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .set('Authorization', helper.createToken(2, 'alexismajyambere@gmail.com', true, 'admin'))
      .send({ email: 'rswhqweb@gmail.com', new_role: 'admin' })
      .end((err, res) => {
        res.should.have.status(409);
        res.should.be.an('object');
        res.should.have.property('status').eql(409);
        done();
      });
  });

  it('should return error when user is not system administrator', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .set('Authorization', helper.createToken(2, 'alexismajyambere@gmail.com', true, 'requester'))
      .send({ email: 'requester@gmail.com', new_role: 'host' })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.an('object');
        res.should.have.property('status').eql(401);
        done();
      });
  });

  it('should return error when System administrator wants to change his own role', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .set('Authorization', helper.createToken(2, 'andelaeagle@gmail.com', true, 'admin'))
      .send({ email: 'andelaeagle@gmail.com', new_role: 'admin' })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.an('object');
        res.should.have.property('status').eql(400);
        done();
      });
  });

  it('should return error when user has the same role', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .set('Authorization', helper.createToken(2, 'alexismajyambere@gmail.com', true, 'admin'))
      .send({ email: 'requester@gmail.com', new_role: 'requester' })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.an('object');
        res.should.have.property('status').eql(400);
        done();
      });
  });

  it('should return error when user is not verified', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .set('Authorization', helper.createToken(2, 'alexismajyambere@gmail.com', true, 'admin'))
      .send({ email: 'dummy@gmail.com', new_role: 'host' })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.an('object');
        res.should.have.property('status').eql(400);
        done();
      });
  });

  it('should return 200 when it succeds', (done) => {
    chai.request(app)
      .put('/api/v1/users/role')
      .set('Authorization', helper.createToken(2, 'alexismajyambere@gmail.com', true, 'admin'))
      .send({ email: 'requester@gmail.com', new_role: 'host' })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.an('object');
        res.should.have.property('status').eql(200);
        done();
      });
  });
});


describe('Get all the user with their roles', () => {
  it('Should return all user', (done) => {
    chai.request(app)
      .get('/api/v1/users/roles')
      .set('Authorization', helper.createToken(2, 'alexismajyambere@gmail.com', true, 'admin'))
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('status').eql(200);
        done();
      });
  });
  it('Should return error when not admin', (done) => {
    chai.request(app)
      .get('/api/v1/users/roles')
      .end((err, res) => {
        res.should.have.status(401);
        res.should.have.property('status').eql(401);
        done();
      });
  });
});
