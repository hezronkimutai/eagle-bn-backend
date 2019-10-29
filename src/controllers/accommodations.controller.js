import sendResult from '../utils/sendResult';
import AccommodationService from '../services/accommodation.service';
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

      const imageRes = await AccommodationService.createAccommodationImage(result.url, data.id);
      data.images.push(imageRes.imageurl);
      success += 1;
      checkIfAllUploaded(numberofImages, res, data, msg);
    });
  });
};

const Accommodation = {
  async addAccommodation(req, res) {
    const { userId } = req.userData;
    const response = await AccommodationService.createAccommodation(
      req.body,
      userId,
    );
    uploadImages(req, res, response);
  },

  async getAccommodation(req, res) {
    const { role, userId } = req.userData;

    if (role === 'host') {
      const accommodations = await AccommodationService.getAllAccommodationsByHost(userId);

      return sendResult(res, 200, 'my accommodations', accommodations);
    }

    const accommodations = await AccommodationService.getAllAccommodations();
    return sendResult(res, 200, 'all accommodations', accommodations);
  },

  async editAccommodation(req, res) {
    const { id } = req.params;
    await AccommodationService.updateAccommodation(req.body, id);
    if (req.files) {
      await AccommodationService.deleteAccommodationImages(id);
    }
    const returnData = await AccommodationService.getAccommodationById(id);
    uploadImages(req, res, returnData, 'Accommodation data/images updated successfully');
  },

  async deleteAccommodation(req, res) {
    await AccommodationService.deleteAccommodationById(req.params.id);
    const returnAccommo = await AccommodationService.getAccommodationById(req.params.id);
    if (!returnAccommo) {
      return sendResult(res, 200, 'The accommodation facility data has been deleted', returnAccommo);
    }
  },

};
export default Accommodation;
