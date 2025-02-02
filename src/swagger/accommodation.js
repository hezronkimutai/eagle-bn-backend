/**
 * @swagger
 * definitions:
 *   Accommodation:
 *     type: object
 *     required:
 *     properties:
 *       id:
 *         type: string
 *       userid:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: string
 *       availableSpace:
 *         type: string
 *       cost:
 *         type: string
 *       services:
 *         type: string
 *       amenities:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   editAccommodation:
 *     type: object
 *     required:
 *       - UserId
 *       - name
 *       - description
 *       - address
 *       - availablesspace
 *       - services
 *       - cost
 *       - amenities
 *       - currency
 *     properties:
 *       userId:
 *         type: integer
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: string
 *       availablesspace:
 *         type: string
 *       services:
 *         type: string
 *       cost:
 *         type: integer
 *       currency:
 *         type: integer
 *       amenities:
 *         type: string
 *       tcreatedAt:
 *         type: string
 *       updatedAt:
 *         type: string
 */

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
