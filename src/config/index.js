import nodemailer from 'nodemailer';
import msgHelper from '../utils/emailHelper';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_SERVICE,
    pass: process.env.MAIL_PASSWORD,
  },
});
const msg = (user, helper) => {
  const from = process.env.MAIL_SERVICE;
  const { subject, html } = msgHelper(user, helper);
  return { from, subject, html };
};

export { msg, transporter };
