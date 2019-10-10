import helpers from '../utils/helper';
import db from '../database/models/index';
import sendResult from '../utils/sendResult';
import { msg, transporter } from '../config';

const email = {

  async sendReset(req, res) {
    const message = { ...msg(req, helpers), to: req.user.email };
    transporter.sendMail(message, (error) => {
      if (error) return res.status(400).send({ error: 400, message: error.message });
      sendResult(res, 201, `password reset instructions sent to ${req.user.email}`);
    });
  },
  async resetPass(req, res) {
    const userInfo = await helpers.decodeToken(req.params.token);
    if (userInfo.error) return sendResult(res, 400, userInfo.error);
    const password = helpers.hashPassword(req.body.password);
    db.Users.update({ password }, { where: { email: userInfo.email }, },);
    sendResult(res, 200, 'password updated successfully');
  }
};

export default email;
