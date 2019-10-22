import Check from '../utils/validator';
import sendResult from '../utils/sendResult';

const validator = {
  profile(req, res, next) {
    try {
      new Check({ username: req }).str().alphaNum();
      new Check({ password: req }).str().withSpec().confirm();
      new Check({ gender: req }).str().gender();
      new Check({ dob: req }).str().alphaNum();
      new Check({ address: req }).str().min(2);
      new Check({ city: req }).str().alpha();
      new Check({ state: req }).str().alpha();
      new Check({ department: req }).str().alpha();
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  signup(req, res, next) {
    try {
      new Check({ email: req }).req().email();
      new Check({ username: req }).req().min(2).alpha();
      new Check({ password: req }).req().withSpec().min(8)
        .confirm();
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  accommodation(req, res, next) {
    try {
      new Check({ description: req }).str().req().min(5);
      new Check({ address: req }).str().req().min(5);
      new Check({ availableSpace: req }).str().req().min(5);
      new Check({ cost: req }).req().num();
      new Check({ services: req }).str().req().min(5);
      new Check({ amenities: req }).str().req().min(5);
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  searchValidate(req, res, next) {
    try {
      new Check({ description: req }).str().req().min(5);
      new Check({ UserId: req }).str().req().min(5);
      new Check({ destination: req }).str().req().min(5);
      new Check({ origin: req }).req().num();
      new Check({ duration: req }).str().req().min(5);
      new Check({ status: req }).str().req().min(5);
      new Check({ start_date: req }).str().req().min(5);
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },
};
// request ID, owner, destination, origin, duration, start date, request status
export default validator;
