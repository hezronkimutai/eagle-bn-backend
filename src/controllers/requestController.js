/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import db from '../database/models';
import sendResult from '../utils/sendResult';
import reqData from '../utils/getReqWithTrip';

const Request = {
  async getRequest(req, res) {
    const requests = await db.Requests.findAll({ where: { UserId: req.userId }, raw: true });
    for (const index in requests) {
      requests[index].Trips = await db.Trips.findAll({ where: { RequestId: requests[index].id }, raw: true, attributes: { exclude: ['RequestId'] } });
    }
    return sendResult(res, 200, 'Requests', requests);
  },

  async changeRequestStatus(req, res) {
    const { status } = req.params;
    const { request } = req;
    if (request.status === 'pending') {
      const newRequest = await request.update({ status });
      return sendResult(res, 200, 'updated successfully', newRequest);
    }
    return sendResult(res, 403, 'this request is already approved/rejected');
  },

  async getManagerRequests(req, res) {
    const { status } = req.query;
    const { managerId } = req.params;
    const includeUser = { model: db.Users, attributes: ['id', 'email', 'lineManager'], where: { lineManager: managerId } };
    let requests;
    if (status) {
      requests = await db.Requests.findAll({
        where: { status },
        include: [includeUser],
      });
    } else {
      requests = await db.Requests.findAll({
        include: [includeUser]
      });
    }
    sendResult(res, 200, 'request list', requests);
  },

  async search(req, res) {
    const data = await reqData(req);
    const entries = Object.entries(req.query);
    let newData;
    for (const [key, value] of entries) {
      newData = data.filter((e) => e[key].match(value));
    }
    return sendResult(res, 200, 'Requests', newData);
  }

};

export default Request;
