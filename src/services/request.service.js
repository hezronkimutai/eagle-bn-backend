import db from '../database/models/index';

export default {
  async getAllRequestByUserId(userId) {
    const result = await db.Requests.findAll({
      where: { UserId: userId },
      include: { model: db.Trips, attributes: { exclude: ['RequestId'] } } });
    return result;
  },

  async getAllRequests() {
    const result = await db.Requests.findAll({
      include: { model: db.Trips, attributes: { exclude: ['RequestId'] } }
    });
    return result;
  },

  async createRequest(country, city, returnTime, timeZone, UserId, trips) {
    const requestResult = await db.Requests.create({ country, city, returnTime, timeZone, UserId, status: 'pending' });
    const request = requestResult.get({ plain: true });
    trips.forEach(trip => {
      trip.RequestId = requestResult.id;
    });
    request.trips = await db.Trips.bulkCreate(trips);
    return request;
  },

  async updateRequest(newRequestData, request) {
    const result = await request.update(newRequestData);
    return result;
  },

  async getRequestById(id) {
    const result = await db.Requests.findOne({
      where: { id },
      include: { model: db.Trips, attributes: ['RequestId'], where: { RequestId: id } }
    });
    return result;
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
  }
};

