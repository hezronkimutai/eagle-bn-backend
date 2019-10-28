import sendResult from '../utils/sendResult';
import requestService from '../services/request.service';
import emailService from '../services/email.service';

const RequestsController = {
  async getRequest(req, res) {
    try {
      const requests = await requestService.getAllRequestByUserId(req.userData.userId);
      return sendResult(res, 200, 'Requests', requests);
    } catch (err) {
      return sendResult(res, 400, 'something went wrong!');
    }
  },

  async postRequest(req, res) {
    try {
      const { country, city, returnTime, trips, timeZone } = req.body;
      const { userId } = req.userData;
      // eslint-disable-next-line max-len
      const data = await requestService.createRequest(country, city, returnTime, timeZone, userId, trips);
      return sendResult(res, 201, 'request created', data);
    } catch (err) {
      return sendResult(res, 400, 'something went wrong!');
    }
  },

  async changeRequestStatus(req, res) {
    const { status } = req.params;
    const { request } = req;
    if (request.status === 'pending') {
      const data = await requestService.updateRequest({ status }, request);
      emailService.sendRequestStatusMail(req, data);
      return sendResult(res, 200, 'updated successfully', data);
    }
    return sendResult(res, 403, 'this request is already approved/rejected');
  },

  async getSingleRequest(req, res) {
    sendResult(res, 200, 'request data', req.request);
  },

  async getManagerRequests(req, res) {
    const { status } = req.query;
    const { managerId } = req.params;
    const data = await requestService.getRequestByManagerId(managerId, status);
    sendResult(res, 200, 'request list', data);
  }
};

export default RequestsController;
