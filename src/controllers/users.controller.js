/* eslint-disable object-curly-newline */
import helpers from '../utils/helper';
import db from '../database/models/index';
import sendResult from '../utils/sendResult';
import string from '../utils/stringHelper';
import { transporter } from '../config';
import UserService from '../services/user.service';

const User = {
  async signup(req, res) {
    const { fullname, password, email } = req.body;
    const response = await UserService.createUser(fullname, password, email);
    const Role = await db.Roles.findOne({ where: response.dataValues.RoleId });
    const userData = response.get({ plain: true });
    userData.password = undefined;
    const token = helpers.createToken(userData.id, email, false, false);
    // send verification email the user,
    await transporter.sendMail({ to: email, from: process.env.EMAIL_SENDER, subject: 'email verification', html: string.emailBody(req, token) });
    const data = { ...userData, Role: Role.roleValue };
    return sendResult(res, 201, 'Account created successfully', data);
  },

  async login(req, res) {
    const { email, password } = req.body;
    const userInfo = await UserService.getUserByEmail(email);
    if (!userInfo) return sendResult(res, 400, 'The email and/or password is invalid');
    const comfirmPass = helpers.comparePassword(password, userInfo.password);
    if (comfirmPass) {
      const {
        id, isverified, Role, fullname, rememberMe
      } = userInfo;
      // eslint-disable-next-line max-len
      const token = helpers.createToken(id, email, isverified, Role.roleValue, rememberMe, fullname);
      const data = {
        userid: id, fullname, email, isverified, token
      };
      if (!isverified) {
        return sendResult(res, 400, 'Please verify your account first');
      }
      return sendResult(res, 201, 'User logged successfully', data);
    }
    return sendResult(res, 400, 'The email and/or password is invalid');
  },

  async verifyEmail(req, res) {
    try {
      const user = await helpers.verifyToken(helpers.getToken(req));
      if (!user || user.error || !(user.userId) || !(user.email)) return sendResult(res, 401, 'invalid token, try to check your email again');
      await UserService.updateUserById(user.userId, { isverified: true });
      return sendResult(res, 200, 'email verified! try to login with your existing account');
    } catch (error) {
      return sendResult(res, 500, `it is not you, it is us\n${error.message}`);
    }
  },


  async OauthLogin(req, res) {
    const data = UserService.findOrCreateUser(req.user, req.user.email);
    const {
      id, fullname, email, isverified, rememberMe
    } = data;
    return sendResult(res, 201, 'User logged successfully', {
      id,
      fullname,
      email,
      token: helpers.createToken(id, email, isverified, rememberMe, fullname)
    });
  },

  async updateProfile(req, res) {
    const { email, role, ...updateData } = {
      ...req.body, avatar: req.imgLink, password: helpers.hashPassword(req.body.password)
    };
    const user = await UserService.updateUserByEmail(updateData, req.user.email);
    const { password, ...data } = user;
    return sendResult(res, 200, 'Profile updated successfully', data);
  },

  async getProfile(req, res) {
    const { password, ...data } = req.user;
    return sendResult(res, 200, 'my profile', data);
  },

  async userSubscription(req, res) {
    const { id } = req.user;
    const { subscription } = req.params;
    const receiveEmails = (subscription === 'subscribe');
    await UserService.manageUserSubscription(id, receiveEmails);
    sendResult(res, 200, `you have been ${subscription}ed successfully`);
  }

};
export default User;
