import sendResult from '../utils/sendResult';

const Accommodation = {
  checkViewAccommodation(req, res, next) {
    const { userData } = req;
    if (userData.role === 'host' || userData.role === 'TAdmin') {
      return next();
    }
    return sendResult(res, 401, 'You are not authorized');
  },

  checkForImages(req, res, next) {
    const { files } = req;
    let imageArray = [];

    if (!files) {
      return sendResult(res, 400, 'upload at least one image');
    }

    const { images } = files;
    if (Array.isArray(images)) { imageArray = images; } else imageArray.push(images);

    // eslint-disable-next-line arrow-parens
    const wrongFile = imageArray.find(file => !file.mimetype || !file.mimetype.startsWith('image'));

    if (wrongFile) return sendResult(res, 400, 'uploaded files should be images');
    req.imageArray = imageArray;
    return next();
  }
};

export default Accommodation;
