import db from '../database/models/index';

const AccommodationService = {
  async getAccommodationById(accommodationId) {
    const accommodation = await db.Accommodations.findOne({
      where: { id: accommodationId, },
      include: [{ model: db.AccommodationImages, attributes: { exclude: ['id', 'accommodationid', 'createdAt', 'updatedAt'] } }],
    });
    return accommodation;
  },

  async getAllAccommodations() {
    const accommodations = await db.Accommodations.findAll();
    return accommodations;
  },

  async getAllAccommodationsByHost(hostId) {
    const accommodations = await db.Accommodations.findAll({
      where: { userid: hostId },
      include: [{ model: db.AccommodationImages, attributes: { exclude: ['id', 'accommodationid', 'createdAt', 'updatedAt'] } }],
    });
    return accommodations;
  },

  async createAccommodation(request, userId) {
    const {
      name, description, address, availableSpace, cost, services, amenities
    } = request;
    const newAccommodation = await db.Accommodations.create({
      name, description, address, availableSpace, cost, services, amenities, userid: userId
    });
    const accommodation = newAccommodation.get({ plain: true });
    return accommodation;
  },

  async updateAccommodation(newAccommodationData, accommodationid) {
    const accommodation = await this.getAccommodationById(accommodationid);
    await accommodation.update(newAccommodationData);
  },

  async deleteAccommodationById(accommodationId) {
    await db.Accommodations.destroy({
      where: { id: accommodationId, },
    });
  },

  async createAccommodationImage(imageurl, accommodationid) {
    const imageRes = await db.AccommodationImages.create({
      imageurl,
      accommodationid,
    });
    return imageRes;
  },

  async deleteAccommodationImages(accommodationId) {
    await db.AccommodationImages.destroy({
      where: { accommodationid: accommodationId, },
    });
  },

};
export default AccommodationService;
