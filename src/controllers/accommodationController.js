import sendResult from '../utils/sendResult';
import db from '../database/models/index';
import cloudinary from '../config/clound-config';
import BookmarkService from '../services/bookmark.service';

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
    uploadImages(req, res, accommodation);
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

  async bookmarkAccommodation(req, res) {
    const { userId } = req.userData;
    const { accommodationId } = req.params;

    const bookmarkData = { UserId: userId, AccommodationId: accommodationId };
    const result = await BookmarkService.bookmark(bookmarkData);
    const status = result[1] ? 201 : 200;
    return sendResult(res, status, 'Accommodation bookmarked Successfully');
  },

  async undoBookmark(req, res) {
    const { userId } = req.userData;
    const { accommodationId } = req.params;

    const bookmarkData = { UserId: userId, AccommodationId: accommodationId };
    await BookmarkService.undoBookmark(bookmarkData);
    return sendResult(res, 200, 'Accommodation bookmark deleted Successfully');
  },

  async getBookmarkedAccommodations(req, res) {
    const { userId } = req.userData;
    const result = await BookmarkService.getBookmarkedAccommodation(userId);
    return sendResult(res, 200, 'bookmarked accommodations', result);
  }
};
export default Accommodation;
