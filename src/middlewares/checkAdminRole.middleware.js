
import sendResult from '../utils/sendResult';
import helper from '../utils/helper';

const checkAdmin = (req, res, next) => {
  const token = helper.getToken(req);
  const data = helper.verifyToken(token);

  if (data.error) {
    return sendResult(res, 401, 'You are not authorized');
  }
  if (data.role !== 'admin') return sendResult(res, 401, 'You are not authorized,You need to be a System administrator');

  if (data.email === req.body.email) return sendResult(res, 400, 'You are not authorized,You can\'t change our own role  ');

  req.userData = data;
  return next();
};

export default checkAdmin;
