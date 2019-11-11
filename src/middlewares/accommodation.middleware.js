import sendResult from '../utils/sendResult';
import db from '../database/models/index';
import AccommodationService from '../services/accommodation.service';

const checkForWrongFile = (files, req, res, next) => {
  let imageArray = [];
  const { images } = files;
  if (Array.isArray(images)) { imageArray = images; } else imageArray.push(images);

  // eslint-disable-next-line arrow-parens
  const wrongFile = imageArray.find(file => !file.mimetype || !file.mimetype.startsWith('image'));

  if (wrongFile) return sendResult(res, 400, 'uploaded files should be images');
  req.imageArray = imageArray;
  return next();
};

const Accommodation = {
  async isSupplierAccommodation(req, res, next) {
    try {
      const accomUser = await db.Accommodations.findOne({
        where: { id: req.params.id, },
      });
      if (!accomUser) {
        return sendResult(res, 400, 'The accommodation facillity not found');
      }
      if (req.userData.userId !== accomUser.userid && req.userData.role !== 'Tadmin') {
        return sendResult(res, 401, 'The accommodation facility does not belong to you');
      }
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
    return next();
  },

  checkForImages(req, res, next) {
    const { files } = req;
    if (!files) {
      return sendResult(res, 400, 'upload at least one image');
    }
    return checkForWrongFile(files, req, res, next);
  },
  checkForImagesUpdate(req, res, next) {
    const { files } = req;

    if (files) {
      return checkForWrongFile(files, req, res, next);
    }
    return next();
  },

  async isAccommodationAvailable(req, res, next) {
    const { AccommodationId } = req.body;
    if (await AccommodationService
      .checkAccommodationAvailability(AccommodationId)) {
      return next();
    }
    return sendResult(res, 404, 'The Accommodation is booked out');
  },

  async accommodationExists(req, res, next) {
    const AccommodationId = req.body.AccommodationId || req.params.accommodationId;
    if (await AccommodationService.getAccommodation(AccommodationId)) {
      return next();
    }
    return sendResult(res, 404, 'The Accommodation is not found');
  }
};

export default Accommodation;
