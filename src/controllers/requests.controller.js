/* eslint-disable no-restricted-syntax */
import db from '../database/models';
import sendResult from '../utils/sendResult';
import { msg, transporter } from '../config';
import allRequest from '../utils/requestUtils';

const sendMail = (req, res, newRequest) => {
  const title = `Request ${newRequest.status}`;
  const url = `/api/v1/requests/${newRequest.id}`;
  const actionMsg = 'View request';
  const emailMsg = `Your viewing this message because your request has been ${newRequest.status} at Barefoot nomard`;
  const message = { ...msg(req, url, title, emailMsg, actionMsg), to: req.user.email };
  transporter.sendMail(message, () => {
    sendResult(res, 200, 'updated successfully', newRequest);
  });
};

const Request = {
  async getRequest(req, res) {
    try {
      const requests = await allRequest.getUserRequest(req.userData.userId);
      return sendResult(res, 200, 'Requests', requests);
    } catch (err) {
      return sendResult(res, 400, 'something went wrong!');
    }
  },

  async postRequest(req, res) {
    try {
      const { country, city, returnTime, trips, timeZone } = req.body;
      const request = {};
      request.country = country;
      request.city = city;
      request.UserId = req.userData.userId;
      request.status = 'pending';
      request.timeZone = timeZone;
      if (returnTime) request.returnTime = returnTime;
      let Req = await db.Requests.create(request);
      Req = Req.get({ plain: true });
      const Trips = [];
      let index = 0;
      for (const trip of trips) {
        const single = {};
        single.country = trip.country;
        single.city = trip.city;
        single.reason = trip.reason;
        single.departureTime = trip.departureTime;
        single.accommodationId = (trip.accommodationId) || null;
        single.RequestId = Req.id;
        // eslint-disable-next-line no-await-in-loop
        Trips[index] = await db.Trips.create(single, { raw: true });
        index += 1;
      }
      Req.trips = Trips;
      return sendResult(res, 201, 'request created', Req);
    } catch (err) {
      return sendResult(res, 400, 'something went wrong!');
    }
  },

  async changeRequestStatus(req, res) {
    const { status } = req.params;
    const { request } = req;
    if (request.status === 'pending') {
      const newRequest = await request.update({ status });
      return sendMail(req, res, newRequest);
    }
    return sendResult(res, 403, 'this request is already approved/rejected');
  },

  async getSingleRequest(req, res) {
    sendResult(res, 200, 'request data', req.request);
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
  }
};

export default Request;
