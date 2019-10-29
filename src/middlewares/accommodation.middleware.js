import sendResult from '../utils/sendResult';
import db from '../database/models/index';

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
      if (req.userData.userId !== accomUser.userid) {
        return sendResult(res, 401, 'The accommodation facility does not belong to you');
      }
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
    return next();
  },

  checkViewAccommodation(req, res, next) {
    const { userData } = req;
    if (userData.role === 'host' || userData.role === 'TAdmin') {
      return next();
    }
    return sendResult(res, 401, 'You are not authorized');
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
};

export default Accommodation;
