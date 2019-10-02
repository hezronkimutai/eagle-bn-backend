import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import theserver from '../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('It should connect the server', () => {
  it('should return the server port 3000', () => {
    expect(theserver.address().port).to.equal(3000);
  });
  it('It return "undefined" if it fails to connect', () => {
    expect(theserver.isProduction).to.equal(undefined);
  });
});
