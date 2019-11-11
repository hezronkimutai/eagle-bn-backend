/* eslint-disable object-curly-newline */
import helpers from '../utils/helper';
import db from '../database/models/index';
import sendResult from '../utils/sendResult';
import UserService from '../services/user.service';
import EmailService from '../services/email.service';

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
    delete userData.password;
    // SEND VERIFICATION EMAIL TO USER
    await EmailService.sendVerificationEmail(req, userData);
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
        id, isverified, Role, fullname, rememberMe
      } = userInfo;
      // eslint-disable-next-line max-len
      const token = helpers.createToken(id, email, isverified, Role.roleValue, rememberMe, fullname);
      const data = {
        userid: id, fullname, email, isverified, token,
      };

      if (!isverified) {
        return sendResult(res, 400, 'Please verify your account first');
      }
      await UserService.updateUser({ isLogged: true }, { id });
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

    const user = await db.Users.update(updateData, {
      where: { email: req.user.email }, returning: true, raw: true
    });

    const { password, ...data } = user[1][0];
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
  },

  async logout(req, res) {
    const data = { isLogged: false };
    const condition = { id: req.user.userId };
    await UserService.updateUser(data, condition);
    sendResult(res, 200, 'Logout successful');
  }

};
export default User;
