import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../index';
import helpers from '../utils/helper';

chai.use(chaiHttp);
chai.should();
describe('Password Reset', () => {
  it('Should search in database', (done) => {
    chai.request(app)
      .get('/api/v1/requests/search?status=pending&address=kigali&destination=Kampala')
      .set('Authorization', helpers.createToken(1, 'andelaeagle@gmail.com', true, 'admin'))
      .set('Content-Type', 'multipart/form-data')
      .field({ city: 'kampala' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Search results');
        done();
      });
  });
});
