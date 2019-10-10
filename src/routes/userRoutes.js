import express from 'express';
import userController from '../controllers/userController';
import signupValidator from '../validation/signupValidation';
import email from '../controllers/email';
import UserMiddle from '../middlewares/userMiddlware';

const app = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     description: Signup
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: user
 *        description: The user to be created
 *        schema:
 *          type: object
 *          required:
 *            - username
 *            - email
 *            - password
 *            - confirmPassword
 *          properties:
 *            username:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       201:
 *         description: Account created successfuly
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               $ref: '#/definitions/User'
 *             msg:
 *               type: string
 *       400:
 *         description: Wrong data sent
 *       409:
 *         description: An account with the same email exists
 */
/**
 * @swagger
 * /users/login:
 *   post:
 *     description: Login
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: body
 *        name: user
 *        description: The user to login with email and password
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       201:
 *         description: User logged successfuly
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               $ref: '#/definitions/login'
 *             msg:
 *               type: string
 *       401:
 *         description: login faild. invalid data !!
 */
app.post('/signup', signupValidator, UserMiddle.checkuserExist, userController.signup);
app.post('/login', UserMiddle.checkloginEntries, userController.login);
/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     description: resetPassword
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: body
 *        email: email
 *        description: Should send password reset instructions
 *        schema:
 *          type: object
 *          required:
 *            - email
 *          properties:
 *            email:
 *              type: string
 *     responses:
 *       201:
 *         description: Password reset instructions sent to user email
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       400:
 *         description: bad request
 */

app.post('/reset-password', UserMiddle.validateEmail, UserMiddle.getUserbyEmail, email.sendReset);

/**
 * @swagger
 * /users/reset-password:
 *   patch:
 *     description: resetPassword
 *     produces:
 *      - application/json
 *     parameters:
 *      - in: body
 *        password: password
 *        confirmPassword: ConfirmPassword
 *        description: Should successfully reset password
 *        schema:
 *          type: object
 *          required:
 *            - password: password
 *            - confirmPassword: confirmPassword
 *          properties:
 *            password:
 *              type: string
 *            confirmPassword:
 *              type: string
 *     responses:
 *       201:
 *         description: Confirm password and Reset
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       400:
 *         description: bad request
 */
app.patch('/reset-password/:token', UserMiddle.validatePass, email.resetPass);

export default app;
