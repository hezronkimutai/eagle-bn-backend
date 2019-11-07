import sendResult from '../utils/sendResult';
import db from '../database/models/index';
import uploadService from '../services/upload.service';


const Accommodation = {
  async addAccommodation(req, res) {
    const {
      description, address, availableSpace, cost, amenities, services, currency, name
    } = req.body;
    const { userId } = req.userData;
    const response = await db.Accommodations.create({
      name,
      description,
      address,
      cost,
      amenities,
      services,
      userid: userId,
      availableSpace,
      currency: (currency) || 'USD',
    });
    const accommodation = response.get({ plain: true });
    uploadService.uploadImages(req, res, accommodation);
  },

  async getAccommodations(req, res) {
    const image = [{ model: db.AccommodationImages, attributes: { exclude: ['id', 'accommodationid', 'createdAt', 'updatedAt'] } }];
    const accommodations = await db.Accommodations.findAll({
      include: image, });

    return sendResult(res, 200, 'Accommodations facilities', accommodations);
  },

  async getAccommodationById(req, res) {
    const { accommodationId } = req.params;
    const image = [{ model: db.AccommodationImages, attributes: { exclude: ['id', 'accommodationid', 'createdAt', 'updatedAt'] } }];
    const accommodation = await db.Accommodations.findOne({
      where: { id: accommodationId }, include: image, });
    return sendResult(res, 200, 'Accommodation facility', accommodation);
  },

  async getAccommodationsByFilter(req, res) {
    const { isAvailable } = req.query;
    const image = [{ model: db.AccommodationImages, attributes: { exclude: ['id', 'accommodationid', 'createdAt', 'updatedAt'] } }];
    const accommodations = await db.Accommodations.findAll({
      where: { isAvailable }, include: image, });
    return sendResult(res, 200, 'Accommodations facilities', accommodations);
  },

  async editAccommodation(req, res) {
    const accommodationData = await db.Accommodations.findOne({
      where: { id: req.params.id, },
    });
    const { id } = req.params;
    await accommodationData.update(req.body);
    if (req.files) {
      await db.AccommodationImages.destroy({
        where: { accommodationid: id, },
      });
    }
    const returnData = await db.Accommodations.findOne({
      where: { id, },
      raw: true,
      include: [{ model: db.AccommodationImages, attributes: { exclude: ['id', 'accommodationid', 'createdAt', 'updatedAt'] } }],
    });
    uploadService.uploadImages(req, res, returnData, 'Accommodation data/images updated successfully');
  },

  async deleteAccommodation(req, res) {
    await db.Accommodations.destroy({
      where: { id: req.params.id, },
    });
    const returnAccommo = await db.Accommodations.findOne({
      where: { id: req.params.id, },
      raw: true,
    });

    if (!returnAccommo) {
      return sendResult(res, 200, 'The accommodation facility data has been deleted', returnAccommo);
    }
  },

};
export default Accommodation;
