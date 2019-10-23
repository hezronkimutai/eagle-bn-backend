import chai from 'chai';
import fs from 'fs';
import path from 'path';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import mockLogin from './mockData/loginMockData';
import helper from '../utils/helper';

chai.use(chaiHttp);
const { expect } = chai;

let Utoken = '';

const img = fs.readFileSync(path.join(__dirname, 'mockData/img.jpeg'));
const img2 = fs.readFileSync(path.join(__dirname, 'mockData/img2.jpeg'));
const wrongFile = fs.readFileSync(path.join(__dirname, 'mockData/email.js'));

describe('accommodation tests', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(mockLogin[0])
      .end((err, res) => {
        expect(res.status).to.equal(201);
        Utoken = res.body.data.token;
        done();
      });
  });

  it('should return 201 status and accommodation data', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', Utoken)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('address', 'Kigali, rwanda')
      .field('description', 'great house')
      .field('cost', '40000')
      .field('availableSpace', '2 rooms')
      .field('services', 'swimming pool')
      .field('amenities', 'free wifi')
      .attach('images', img, 'preview.png')
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data.images[0]).to.contain('http');
        done();
      });
  });

  it('should return 201 status and accommodation data when upload multiple images', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', Utoken)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('address', 'Kigali, rwanda')
      .field('description', 'great house')
      .field('cost', '40000')
      .field('availableSpace', '2 rooms')
      .field('services', 'swimming pool')
      .field('amenities', 'free wifi')
      .attach('images', img, 'preview.png')
      .attach('images', img2, 'preview2.png')
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('images');
        done();
      });
  });

  it('should return 401 status when no token provided', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.msg).to.equals('You are not authorized');
        done();
      });
  });

  it('should return 401 status when user not accommodation supplier', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', helper.createToken(2, 'mmmm@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.msg).to.equals('you are not authorized');
        done();
      });
  });

  it('should return 400 status when no address provided', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', Utoken)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('description', 'great house')
      .field('cost', '40000')
      .field('availableSpace', '2 rooms')
      .field('services', 'swimming pool')
      .field('amenities', 'free wifi')
      .attach('images', img, 'preview.png')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equals('address is required');
        done();
      });
  });

  it('should return 400 status when cost not numeric', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', Utoken)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('address', 'Kigali, rwanda')
      .field('description', 'great house')
      .field('cost', 'llllll')
      .field('availableSpace', '2 rooms')
      .field('services', 'swimming pool')
      .field('amenities', 'free wifi')
      .attach('images', img, 'preview.png')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equals('cost should be a number');
        done();
      });
  });

  it('should return 400 status when no image provided', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', Utoken)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('address', 'Kigali, rwanda')
      .field('description', 'great house')
      .field('cost', '40000')
      .field('availableSpace', '2 rooms')
      .field('services', 'swimming pool')
      .field('amenities', 'free wifi')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equals('upload at least one image');
        done();
      });
  });

  it('should return 400 status when file is not an image', (done) => {
    chai.request(app)
      .post('/api/v1/accommodations')
      .set('Authorization', Utoken)
      .set('Content-Type', 'application/form-data')
      .field('address', 'Kigali, rwanda')
      .field('description', 'great house')
      .field('cost', '40000')
      .field('availableSpace', '2 rooms')
      .field('services', 'swimming pool')
      .field('amenities', 'free wifi')
      .attach('images', wrongFile, 'email.js')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equals('uploaded files should be images');
        done();
      });
  });

  it('should return 200 status and 2 accommodation', (done) => {
    chai.request(app)
      .get('/api/v1/accommodations')
      .set('Authorization', Utoken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.length).to.equals(2);
        done();
      });
  });

  it('should return 200 status and 2 accommodation when user is TAdmin', (done) => {
    chai.request(app)
      .get('/api/v1/accommodations')
      .set('Authorization', helper.createToken(2, 'mmmm@gmail.com', true, 'TAdmin'))
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.length).to.equals(2);
        done();
      });
  });

  it('should return 401 when user not Travel Admin or Acc supplier', (done) => {
    chai.request(app)
      .get('/api/v1/accommodations')
      .set('Authorization', helper.createToken(2, 'mmmm@gmail.com', true, 'requester'))
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
});
