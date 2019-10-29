/* eslint-disable object-curly-newline */
import helpers from '../utils/helper';
import db from '../database/models/index';
import sendResult from '../utils/sendResult';
import string from '../utils/stringHelper';
import { transporter } from '../config';

const User = {
  async signup(req, res) {
    const { fullname, password, email } = req.body;

    const response = await db.Users.create({
      email,
      password: helpers.hashPassword(password),
      fullname
    });
    const Role = await db.Roles.findOne({ where: response.dataValues.RoleId });

    const userData = response.get({ plain: true });
    userData.password = undefined;
    const token = helpers.createToken(userData.id, email, false);
    // send verification email the user,
    await transporter.sendMail({ to: email, from: process.env.EMAIL_SENDER, subject: 'email verification', html: string.emailBody(req, token) });
    const data = { ...userData, Role: Role.roleValue };
    return sendResult(res, 201, 'Account created successfully', data);
  },

  async login(req, res) {
    const { email, password } = req.body;
    const userInfo = await db.Users.findOne({
      where: {
        email
      },
      include: [{ model: db.Roles, attributes: { include: 'roleValue' } }]
    });
    if (!userInfo) return sendResult(res, 400, 'The email and/or password is invalid');
    const comfirmPass = helpers.comparePassword(password, userInfo.password);
    if (comfirmPass) {
      const {
        id, isverified, Role, fullname
      } = userInfo;
      const token = helpers.createToken(id, email, isverified, Role.roleValue);
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
      await db.Users.update(
        { isverified: true },
        {
        // eslint-disable-next-line radix
          where: { id: user.userId },
        },
      );
      return sendResult(res, 200, 'email verified! try to login with your existing account');
    } catch (error) {
      return sendResult(res, 500, `it is not you, it is us\n${error.message}`);
    }
  },
  async OauthLogin(req, res) {
    const [data] = await db.Users.findOrCreate({
      where: { email: req.user.email },
      defaults: req.user
    });
    const {
      id, fullname, email, isverified
    } = data;
    return sendResult(res, 201, 'User logged successfully', {
      id,
      fullname,
      email,
      token: helpers.createToken(id, email, isverified)
    });
  },

  async updateProfile(req, res) {
    const { email, role, ...updateData } = {
      ...req.body, avatar: req.imgLink, password: helpers.hashPassword(req.body.password)
    };

    const user = await db.Users.update(updateData, {
      where: { email: req.user.email }, returning: true, raw: true
    });

    const { password, ...data } = user[1][0];
    return sendResult(res, 200, 'Profile updated successfully', data);
  },

  async getProfile(req, res) {
    const { password, ...data } = req.user;
    return sendResult(res, 200, 'my profile', data);
  }

};
export default User;
