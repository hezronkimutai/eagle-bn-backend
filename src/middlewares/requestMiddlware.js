import db from '../database/models';
import sendResult from '../utils/sendResult';

const requestMidd = {
  async checkExistingTrip(req, res, next) {
    const { requestId } = req.params;
    const request = await db.Requests.findOne({ where: { id: requestId } });
    if (request) {
      req.request = request;
      return next();
    }
    return sendResult(res, 404, 'no request with such an id');
  },

  async checkLineManager(req, res, next) {
    const { request } = req;
    const { userData } = req;
    const user = await db.Users.findOne({ where: { id: request.UserId }, raw: true });
    if (user.lineManager === userData.userId) return next();
    return sendResult(res, 401, 'you are not managing this request');
  },

  async checkManagerId(req, res, next) {
    const { managerId } = req.params;
    const { userData } = req;
    if (userData.userId.toString() === managerId) return next();
    return sendResult(res, 401, 'you are not authorized');
  }
};
export default requestMidd;
