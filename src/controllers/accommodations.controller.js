import sendResult from '../utils/sendResult';
import db from '../database/models/index';
import cloudinary from '../config/clound-config';

let success = 0;
let failure = 0;

const checkIfAllUploaded = (total, res, data, msg) => {
  if (success + failure === total) return sendResult(res, 201, msg, data);
};

const uploadImages = (req, res, data, msg) => {
  if (!req.imageArray) return sendResult(res, 200, msg, data);
  const numberofImages = req.imageArray.length;
  data.images = [];
  req.imageArray.forEach((element) => {
    cloudinary.uploader.upload(element.tempFilePath, async (result, error) => {
      if (error) { failure += 1; checkIfAllUploaded(numberofImages, res, data, msg); }

      const imageRes = await db.AccommodationImages.create({
        imageurl: result.url,
        accommodationid: data.id,
      });
      data.images.push(imageRes.imageurl);
      success += 1;
      checkIfAllUploaded(numberofImages, res, data, msg);
    });
  });
};

const Accommodation = {
  async addAccommodation(req, res) {
    const {
      description, address, availableSpace, cost, amenities, services
    } = req.body;
    const { userId } = req.userData;
    const response = await db.Accommodations.create({
      description,
      address,
      cost,
      amenities,
      services,
      userid: userId,
      availableSpace,
    });
    const accommodation = response.get({ plain: true });
    uploadImages(req, res, accommodation);
  },

  async getAccommodation(req, res) {
    const { role, userId } = req.userData;

    if (role === 'host') {
      const accommodations = await db.Accommodations.findAll({
        where: { userid: userId },
        include: [{ model: db.AccommodationImages, attributes: { exclude: ['id', 'accommodationid', 'createdAt', 'updatedAt'] } }],
      });

      return sendResult(res, 200, 'my accommodations', accommodations);
    }

    const accommodations = await db.Accommodations.findAll();
    return sendResult(res, 200, 'all accommodations', accommodations);
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
    uploadImages(req, res, returnData, 'Accommodation data/images updated successfully');
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
