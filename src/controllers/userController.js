/* eslint-disable require-jsdoc */
import helpers from '../utils/helper';
import db from '../database/models/index';
import sendResult from '../utils/sendResult';

const User = {
  async signup(req, res) {
    const { username, password, email } = req.body;

    const response = await db.Users.create({
      email,
      password: helpers.hashPassword(password),
      username
    });

    const userData = response.get({ plain: true });
    userData.password = undefined;
    const token = helpers.createToken(userData.id, email, false);
    const data = { ...userData, token };
    return sendResult(res, 201, 'Account created successfully', data);
  },
};
export default User;
