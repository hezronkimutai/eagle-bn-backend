/**
 * @swagger
 * /requests/:
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        description: The token
 *   produces:
 *      - application/json
 *   get:
 *     description: get requests
 *     tags:
 *       - Requests
 *     responses:
 *       200:
 *         description: trips
 *         schema:
 *           type: object
 *       400:
 *         description: Wrong data sent
 *   post:
 *     description: create request
 *     tags:
 *       - Requests
 *     parameters:
 *      - in: body
 *        name: request
 *        description: Request data
 *        schema:
 *          type: object
 *          required:
 *            - country
 *            - city
 *            - returnDate
 *            - trips
 *            - timeZone
 *          properties:
 *            country:
 *              type: string
 *            city:
 *              type: string
 *            returnDate:
 *              type: string
 *            timeZone:
 *              type: string
 *            trips:
 *              type: array
 *              items:
 *               $ref: '#/definitions/Trip'
 *     responses:
 *       201:
 *         description: trips
 *         schema:
 *           type: object
 *       400:
 *         description: Wrong data sent
 */

/**
 * @swagger
 * definitions:
 *   Trip:
 *     type: object
 *     required:
 *     properties:
 *       departureTime:
 *         type: string
 *       country:
 *         type: string
 *       city:
 *         type: string
 *       reason:
 *         type: string
 *       accommodationId:
 *         type: string
 */

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
/**
 * @swagger
 * /requests/search?status=pending:
 *   get:
 *     description: user should be able to search in the query
 *     tags:
 *      - search Requests
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        description: The token
 *      - in: query
 *        name: request data
 *        schema:
 *          type: string
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
 */
