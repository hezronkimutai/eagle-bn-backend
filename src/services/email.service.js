import { msg, transporter } from '../config';
import sendResult from '../utils/sendResult';

/**
 * @export
 * @class EmailUtil
 */
export default class EmailUtil {
  /**
   * register a new
   * @static
   * @param {Object} req the request
   * @param {Object} notification the notification to be sent to the user
   * @memberof EmailUtil
   * @returns {Object} sendEmail
   */
  static async sendEmail(req, notification) {
    const { title } = notification;
    const { url } = notification;
    const { actionMsg } = notification;
    const emailMsg = `Your viewing this message because ${notification.type} at Barefoot nomard`;
    const message = { ...msg(req, url, title, emailMsg, actionMsg),
      to: notification.email };
    await transporter.sendMail(message);
  }

  /**
   * register a new
   * @static
   * @param {Object} req the request
   * @param {number} requestId the id of the request created
   * @param {string} userEmail the email of the user who created the request
   * @param {string} managerEmail the email of the manager to send email on.
   * @memberof EmailUtil
   * @returns {Object} sendEmail
   */
  static async newRequestNotificationToManager(req, requestId, userEmail, managerEmail) {
    const notification = {
      title: 'New Trip Request',
      url: `/api/v1/requests/${requestId}`,
      actionMsg: 'View Trip Request',
      type: `new trip request was initiated by ${userEmail}`,
      email: managerEmail
    };
    await this.sendEmail(req, notification);
  }

  /**
   * register a new
   * @static
   * @param {Object} req the request
   * @param {Object} res the reponse
   * @param {Object} newRequest the notificion to be sent
   * @memberof EmailUtil
   * @returns {Object} sendResult
   */
  static async requestedStatusUpdated(req, res, newRequest) {
    const notification = {
      title: `Request ${newRequest.status}`,
      url: `/api/v1/requests/${newRequest.id}`,
      actionMsg: 'View request',
      type: `your request has been ${newRequest.status}`,
      email: req.user.email,
    };
    await this.sendEmail(req, notification);
    return sendResult(res, 200, 'updated successfully', newRequest);
  }
}
