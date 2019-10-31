import Check from '../utils/validator';
import sendResult from '../utils/sendResult';

const validateSignup = (req, res, next) => {
  const valid = [
    new Check({ email: req }).req().email(),
    new Check({ username: req }).req().min(2).alpha(),
    new Check({ password: req }).req().alphaNum().min(8),
  ];

  const invalid = valid.find((e) => e.error);
  if (invalid) return sendResult(res, 400, invalid.error);
  return next();
};

export default validateSignup;
