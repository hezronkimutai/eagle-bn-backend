import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import AccommodationsController from '../controllers/accommodations.controller';
import AccommodationMiddleware from '../middlewares/accommodation.middleware';
import UserMiddleware from '../middlewares/user.middleware';
import valid from '../validation';
import RoleMiddleware from '../middlewares/role.middleware';

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
const fUpload = fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../temp'),
});

const {
  isSupplierAccommodation, checkForImages, checkForImagesUpdate
} = AccommodationMiddleware;
const { checkToken } = UserMiddleware;
const {
  addAccommodation, getAccommodation, deleteAccommodation, editAccommodation
} = AccommodationsController;

app.patch('/:id', fUpload, checkToken, RoleMiddleware.checkHost, isSupplierAccommodation, checkForImagesUpdate, valid.editAccommodation, editAccommodation);
app.delete('/:id', checkToken, RoleMiddleware.checkHost, isSupplierAccommodation, deleteAccommodation);
app.post('/', fUpload, checkToken, RoleMiddleware.checkHost, valid.accommodation, checkForImages, addAccommodation);
app.get('/', checkToken, AccommodationMiddleware.checkViewAccommodation, getAccommodation);

export default app;
