import EchoUtil from './echo.util';

const NotificationUtil = {
  echoNotification(req, notification, type, receiverId) {
    notification = notification.get({ plain: true });
    EchoUtil.echo(receiverId, notification, req.connectedClients, req.io, type);
  }
};

export default NotificationUtil;
