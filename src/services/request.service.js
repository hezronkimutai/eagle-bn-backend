import db from '../database/models/index';

const RequestService = {
  async getAllRequestByUserId(userId) {
    const result = await db.Requests.findAll({
      where: { UserId: userId },
      include: { model: db.Trips, attributes: { exclude: ['RequestId'] } } });
    return result;
  },

  async createRequest(request) {
    const requestResult = await db.Requests.create(request);
    return requestResult.get({ plain: true });
  },

  async createTrip(trip) {
    const requestResult = await db.Trips.create(trip);
    return requestResult.get({ plain: true });
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

export default RequestService;
