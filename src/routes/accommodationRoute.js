import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import accommodationCont from '../controllers/accommodationController';
import accMidd from '../middlewares/accommodationMiddleware';
import userMidd from '../middlewares/userMiddlware';
import valid from '../validation';
import roles from '../middlewares/rolesMiddlewares';

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

const { checkForImages } = accMidd;
const { checkToken } = userMidd;
const { addAccommodation, getAccommodation } = accommodationCont;

app.post('/', fUpload, checkToken, roles.checkHost, valid.accommodation, checkForImages, addAccommodation);
app.get('/', checkToken, accMidd.checkViewAccommodation, getAccommodation);

export default app;
