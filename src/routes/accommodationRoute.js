import express from 'express';
import BookingsController from '../controllers/bookings.controller';
import AccommodationsController from '../controllers/accommodationController';
import AccommodationMiddleware from '../middlewares/accommodation.middleware';
import UserMiddleware from '../middlewares/userMiddlware';
import valid from '../validation';
import RoleMiddleware from '../middlewares/rolesMiddlewares';
import LikingsController from '../controllers/likings.controller';
import uploadService from '../services/upload.service';

const app = express.Router();

/**
 * @swagger
 * /accommodations:
 *   post:
 *     description: Create accommodation
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: accommodation
 *        description: Accommodation data
 *        schema:
 *          type: object
 *          required:
 *            - description
 *            - address
 *            - cost
 *            - availableSpace
 *            - services
 *            - amenities
 *          properties:
 *            description:
 *              type: string
 *            address:
 *              type: string
 *            cost:
 *              type: double
 *            availableSpace:
 *              type: string
 *            services:
 *              type: string
 *            amenities:
 *              type: string
 *     responses:
 *       201:
 *         description: Account created successfuly
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               $ref: '#/definitions/Accommodation'
 *             msg:
 *               type: string
 *       400:
 *         description: Wrong data sent
 *       401:
 *         description: You are unauthorized to access this route
 */

/**
 * @swagger
 * /accommodations:
 *   get:
 *     description: Get accommodations
 *     produces:
 *      - application/json
 *     responses:
 *       201:
 *         description: User logged successfuly
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Accommodation'
 *       401:
 *         description: You are not authorized
 */

const {
  isSupplierAccommodation, checkForImages, checkForImagesUpdate
} = AccommodationMiddleware;
const { checkToken } = UserMiddleware;

app.patch('/:id', uploadService.fileUpload, checkToken, RoleMiddleware.checkHostOrTAdmin, isSupplierAccommodation, checkForImagesUpdate, valid.editAccommodation, AccommodationsController.editAccommodation);
app.delete('/:id', checkToken, RoleMiddleware.checkHost, isSupplierAccommodation, AccommodationsController.deleteAccommodation);
app.post('/', uploadService.fileUpload, checkToken, RoleMiddleware.checkHostOrTAdmin, valid.accommodation, checkForImages, AccommodationsController.addAccommodation);
app.get('/', AccommodationsController.getAccommodations);
app.get('/:accommodationId/rating', valid.getReviewvalidation, BookingsController.getRating);
app.get('/search', AccommodationsController.getAccommodationsByFilter);
app.get('/:accommodationId', AccommodationsController.getAccommodationById);
app.post('/:accommodationId/like', [
  checkToken,
  LikingsController.addLikeAccommdation
]);


export default app;
