import express from 'express';
import UserMiddleware from '../middlewares/user.middleware';
import NotificationMiddleware from '../middlewares/notification.middleware';
import NotificationController from '../controllers/notifications.controller';

const app = express.Router();

const { checkToken } = UserMiddleware;
const { checkNotificationExists, checkNotificationOwner } = NotificationMiddleware;
const {
  getUserNotifications, updateNotificationStatus, getSingleNotification,
} = NotificationController;

app.get('/', checkToken, getUserNotifications);
app.get('/:id', checkToken, checkNotificationExists, checkNotificationOwner, getSingleNotification);
app.patch('/:id/:status', checkToken, checkNotificationExists, checkNotificationOwner, updateNotificationStatus);

export default app;
