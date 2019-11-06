/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
import db from '../database/models';
import sendResult from '../utils/sendResult';
import RequestUtil from '../utils/requestUtils';
import requestData from '../utils/getReqWithTrip';
import RequestService from '../services/request.service';
import NotificationService from '../services/notifications.service';
import UserService from '../services/user.service';
import EmailService from '../services/email.service';

const Request = {
  async getRequests(req, res) {
    try {
      const requests = await RequestService.getRequestUtilByUserId(req.userData.userId);
      return sendResult(res, 200, 'Requests', requests);
    } catch (err) {
      return sendResult(res, 400, 'something went wrong!');
    }
  },

  async postRequest(req, res) {
    const { country, city, returnTime, trips, timeZone, rememberMe } = req.body;
    const request = {};
    request.country = country;
    request.city = city;
    request.UserId = req.userData.userId;
    request.status = 'pending';
    request.timeZone = timeZone;
    if (returnTime) request.returnTime = returnTime;
    const Req = await RequestService.createRequest(request);
    const Trips = [];
    let index = 0;
    for (const trip of trips) {
      const single = {};
      single.country = trip.country;
      single.city = trip.city;
      single.reason = trip.reason;
      single.departureTime = trip.departureTime;
      single.RequestId = Req.id;
      // eslint-disable-next-line no-await-in-loop
      Trips[index] = await RequestService.createTrip(single);
      index += 1;
    }
    Req.trips = Trips;

    // GETTING LINEMANAGER OF THE REQUESTER
    const { lineManager } = await UserService.getUser({ id: Req.UserId });
    // CREATING NOTIFICATION OF THIS NEW REQUEST FOR THE MANAGER
    await NotificationService.createNotification({
      modelName: 'Requests',
      modelId: Req.id,
      type: 'new_request',
      userId: lineManager,
    });
    // CHECK IF MANAGER IS SUBSCRIBED TO EMAIL NOTIFICATION
    const { recieveEmails, email } = await UserService.getUser({ id: lineManager });
    if (recieveEmails) {
      // SENDING NOTIFICATION TO THE MANAGER
      await EmailService.newRequestNotificationToManager(req, Req.id, req.userData.email, email);
    }
    if (req.userData.rememberMe !== rememberMe) {
      await db.Users.update({ rememberMe }, {
        where: { userid: req.userData.userId },
      });
      return sendResult(res, 201, 'A request created and personal data remembered', Req);
    }
    return sendResult(res, 201, 'A request created but personal data not remembered', Req);
  },

  async changeRequestStatus(req, res) {
    const { status } = req.params;
    const { request } = req;
    if (request.status === 'pending') {
      const newRequest = await RequestService.updateRequest({ id: request.id }, { status });
      return EmailService.requestedStatusUpdated(req, res, newRequest);
    }
    return sendResult(res, 403, 'this request is already approved/rejected');
  },

  async getSingleRequest(req, res) {
    sendResult(res, 200, 'request data', req.request);
  },

  async getManagerRequests(req, res) {
    const { status } = req.query;
    const { managerId } = req.params;
    const requests = await RequestService.getRequestByManagerId(managerId, status);
    sendResult(res, 200, 'request list', requests);
  },

  async search(req, res) {
    const { tripData, reqData } = requestData(req);
    if (req.user.role !== 'admin' && req.user.role !== 'Tadmin') {
      reqData.UserId = req.user.userId;
    }
    const requests = await RequestService.searchRequests(reqData, tripData);

    return sendResult(res, 200, 'Search results', requests);
  },

  async updateRequest(req, res) {
    const { country, city, returnTime, reason, trip } = req.body;
    const { requestId, tripId } = req.params;
    let request = { country, city, returnTime: new Date(returnTime).toLocaleString() };
    let trips = {
      country: trip.country,
      city: trip.city,
      departureTime: new Date(trip.departureTime).toLocaleString(),
      reason
    };
    const reqData = RequestUtil.getProvidedData(request);
    const tripData = RequestUtil.getProvidedData(trips);
    if (reqData) {
      const condition = { id: requestId, UserId: req.user.id, status: 'pending' };
      request = await RequestService.updateRequest(reqData, condition);
    }
    if (tripData) {
      const condition = { id: tripId };
      trips = await RequestService.updateTrip(tripData, condition);
      request.trip = trips;
    }
    return sendResult(res, 200, 'request update successful', request[1]);
  },

};

export default Request;
