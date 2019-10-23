import express from 'express';
import requestController from '../controllers/requestController';
import { isUserVerified } from '../middlewares';
import reqMidd from '../middlewares/requestMiddlware';
import userMidd from '../middlewares/userMiddlware';
import valid from '../validation';
import roles from '../middlewares/rolesMiddlewares';

const app = express.Router();

/**
 * @swagger
 * /requests/:
 *   get:
 *     description: get requests
 *     tags:
 *      - Requests
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        description: The token
 *     responses:
 *       200:
 *         description: trips
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       400:
 *         description: Wrong data sent
 */

/**
 * @swagger
 * /requests/:requestId/:status:
 *   get:
 *     description: approve/ reject request
 *     tags:
 *      - Requests
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        description: The token
 *      - in: params
 *        name: request data
 *        schema:
 *          type: object
 *          required:
 *            - requestId
 *            - status
 *          properties:
 *            description:
 *              status: string
 *            address:
 *              requestId: int
 *     responses:
 *       200:
 *         description: request data
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       400:
 *         description: Wrong data sents
 *       401:
 *         description: You are not authorized
 *       403:
 *         description: The request is already approved/rejected
 */

const { checkExistingTrip, checkLineManager, checkManagerId } = reqMidd;
const { changeRequestStatus, getManagerRequests } = requestController;
const { checkManager } = roles;
const { checkToken, verifyToken, getUserbyEmail } = userMidd;
const { tripValidation } = valid;

app.get('/', isUserVerified, requestController.getRequest);
app.get('/managers/:managerId', checkToken, checkManager, checkManagerId, getManagerRequests);
app.patch('/:requestId/:status', checkToken, checkManager, checkExistingTrip, checkLineManager, tripValidation, changeRequestStatus);
app.get('/search', verifyToken, getUserbyEmail, requestController.search);

export default app;
