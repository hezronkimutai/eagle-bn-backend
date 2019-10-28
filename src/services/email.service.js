import { msg, transporter } from '../config';

const sendMail = async (req, url, title, emailMsg, actionMsg) => {
  const message = { ...msg(req, url, title, emailMsg, actionMsg), to: req.user.email };
  const email = await transporter.sendMail(message);
  return email;
};
export default {
  async sendRequestStatusMail(req, newRequest) {
    const title = `Request ${newRequest.status}`;
    const url = `/api/v1/requests/${newRequest.id}`;
    const actionMsg = 'View request';
    const emailMsg = `Your viewing this message because your request has been ${newRequest.status} at Barefoot nomard`;
    const emailResult = await sendMail(req, url, title, emailMsg, actionMsg);
    return emailResult;
  },
};
