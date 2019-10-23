import chai from 'chai';
import helpers from '../utils/helper';
import userController from '../controllers/userController';

const { expect } = chai;
const plainPassword = 'lemoissonW';
const hashedPass = helpers.hashPassword(plainPassword);

describe('helper functions', () => {
  it('it should return correct hash result', (done) => {
    expect(helpers.hashPassword()).to.equal(undefined);
    expect(helpers.hashPassword(plainPassword)).to.not.equal(undefined);
    expect(helpers.comparePassword(plainPassword, hashedPass)).to.equal(true);
    expect(helpers.comparePassword('lelel', hashedPass)).to.equal(false);
    done();
  });
  it('should return a jwt token when called', (done) => {
    expect(helpers.createToken(1, 'lll@gmail.com', '')).to.not.equal(undefined);
    done();
  });
  it('should return a jwt token when called', (done) => {
    expect(userController).to.haveOwnProperty('signup');
    done();
  });
});

