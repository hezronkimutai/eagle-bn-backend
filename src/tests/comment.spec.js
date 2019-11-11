import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import helpers from '../utils/helper';

chai.use(chaiHttp);
const { expect } = chai;

describe('/POST comment', () => {
  it('it should return 401 when request id does not exist', (done) => {
    chai.request(app)
      .post('/api/v1/requests/100/comments')
      .set('Authorization', helpers.createToken(3, 'admin@gmail.com', true, 'requester'))
      .send({ comment: 'new Comment' })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
  it('it should return 201 and create new comment data', (done) => {
    chai.request(app)
      .post('/api/v1/requests/1/comments')
      .set('Authorization', helpers.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send({ comment: 'new Comment', requestId: 1 })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data.comment).to.equal('new Comment');
        done();
      });
  });
  it('should return a 400 if one field is missing', (done) => {
    chai.request(app)
      .post('/api/v1/requests/1/comments')
      .set('Authorization', helpers.createToken(2, 'admin@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.msg).to.equal('comment is required');
        done();
      });
  });
  it('should return a 400 when you are not owner of the request or manager', (done) => {
    chai.request(app)
      .post('/api/v1/requests/1/comments')
      .send({ comment: 'new Comment' })
      .set('Authorization', helpers.createToken(2, 'admin@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        done();
      });
  });
});

describe('GET /comment', () => {
  it('should return a 201 when you are owner of the request or manager', (done) => {
    chai.request(app)
      .get('/api/v1/requests/1/comments')
      .set('Authorization', helpers.createToken(3, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal(201);
        done();
      });
  });
  it('should return a 201 when you are owner of the request or manager you want to see the thread', (done) => {
    chai.request(app)
      .get('/api/v1/requests/1/comments')
      .set('Authorization', helpers.createToken(5, 'manager@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal(201);
        done();
      });
  });
  it('it should return 401 when request id does not exist', (done) => {
    chai.request(app)
      .get('/api/v1/requests/100/comments')
      .set('Authorization', helpers.createToken(5, 'admin@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
});


describe('PUT /comment/:commentId', () => {
  it('should return a 201 when you are owner of the request or manager', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/comments/1')
      .set('Authorization', helpers.createToken(3, 'requester@gmail.com', true, 'requester'))
      .send({ comment: 'Updated Comment' })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        done();
      });
  });
  it('should return a 401 when you not authenticated', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/comments/1')
      .send({ comment: 'Updated Comment' })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        done();
      });
  });

  it('should return a 400 missing fields', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/comments/1')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        done();
      });
  });

  it('it should return 404 when comment id does not exist', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/comments/1000')
      .set('Authorization', helpers.createToken(5, 'admin@gmail.com', true, 'manager'))
      .send({ comment: 'new Comment' })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.status).to.equal(404);
        done();
      });
  });
});

describe('DELETE /comment/:commentId', () => {
  it('should return a 401 when you not authenticated', (done) => {
    chai.request(app)
      .delete('/api/v1/requests/1/comments/1')
      .set('Authorization', helpers.createToken(5, 'client@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        done();
      });
  });

  it('should return a 400 when you are not the owner', (done) => {
    chai.request(app)
      .delete('/api/v1/requests/1/comments/1')
      .set('Authorization', helpers.createToken(5, 'requester@gmail.com', true, 'manager'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        done();
      });
  });
  it('should return a 201 when you are owner of the request or manager', (done) => {
    chai.request(app)
      .delete('/api/v1/requests/1/comments/1')
      .set('Authorization', helpers.createToken(3, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        done();
      });
  });
  it('should return a 400 when comment has already been deleted', (done) => {
    chai.request(app)
      .delete('/api/v1/requests/1/comments/1')
      .set('Authorization', helpers.createToken(3, 'requester@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        done();
      });
  });
});

