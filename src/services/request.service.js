import db from '../database/models';

const RequestService = {
  async getOneRequest(condition) {
    const request = await db.Requests.findOne({ where: condition, raw: true, });
    return request;
  },

  async getAllRequestByUserId(userId) {
    const result = await db.Requests.findAll({
      where: { UserId: userId },
      include: { model: db.Trips, attributes: { exclude: ['RequestId'] } } });
    return result;
  },

  async getOnetrip(condition) {
    const trip = await db.Trips.findOne({ where: condition, raw: true });
    return trip;
  },

  async updateRequest(data, condition) {
    const request = await db.Requests.update(data, {
      where: condition, returning: true, plain: true, raw: true,
    });
    return request[1];
  },

  async updateTrip(data, condition) {
    const trip = await db.Trips.update(data, {
      where: condition, returning: true, plain: true, raw: true,
    });
    return trip[1];
  },

  async getTripOwner(id) {
    const { RequestId } = await db.Trips.findOne({ where: { id }, attributes: ['RequestId'] });
    const { UserId } = await db.Requests.findOne({ where: { id: RequestId }, attributes: ['UserId'] });
    return UserId;
  },

  async getRequestByManagerId(id, status) {
    const includeUser = { model: db.Users, attributes: ['id', 'email', 'lineManager'], where: { lineManager: id } };
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
    return requests;
  },

  async searchRequests(reqData, tripData) {
    return db.Requests.findAll({
      where: reqData,
      include: [{ model: db.Trips, where: tripData, required: true }]
    });
  },

  async createRequest(request) {
    const result = await db.Requests.create(request);
    return result.get({ plain: true });
  },

  async createTrip(trip) {
    const result = await db.Trips.create(trip);
    return result.get({ plain: true });
  },
};

export default RequestService;
