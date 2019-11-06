import db from '../database/models';

const NotificationService = {
  getOneNotification: async (id) => db.Notifications.findOne({ where: { id }, raw: true }),
  getAllNotifications: async (userId) => db.Notifications
    .findAll({ where: { userId }, raw: true }),
  createNotification: async (notification) => db.Notifications.create(notification),
  setNotificationStatus: async (id, isRead) => db.Notifications
    .update({ isRead }, { where: { id } }),
  markAllAsRead: async (userId) => db.Notifications.update({ isRead: true }, { where: { userId } }),
};

export default NotificationService;

