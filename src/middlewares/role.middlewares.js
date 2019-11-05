/* eslint-disable arrow-parens */
import sendResult from '../utils/sendResult';

const notAuthorized = res => sendResult(res, 401, 'you are not authorized');
const roles = {
  checkManager(req, res, next) {
    if (req.userData.role === 'manager') return next();
    return notAuthorized(res);
  },

  checkHost(req, res, next) {
    if (req.userData.role === 'host') return next();
    return notAuthorized(res);
  },

  checkHostOrTAdmin(req, res, next) {
    if (req.userData.role === 'host' || req.userData.role === 'Tadmin') return next();
    return notAuthorized(res);
  },

  checkRequester(req, res, next) {
    if (req.userData.role === 'requester') return next();
    return notAuthorized(res);
  }
};
export default roles;
