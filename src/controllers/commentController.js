import db from '../database/models/index';
import sendResult from '../utils/sendResult';
import CommentService from '../services/comment.service';
import NotificationService from '../services/notifications.service';
import UserService from '../services/user.service';
import NotificationUtil from '../utils/notification.util';

const CommentsController = {
  addComment: async (req, res) => {
    const newComment = await db.Comments.create({
      comment: req.body.comment,
      userId: req.userData.userId,
      requestId: req.params.requestId,
    });
    const { lineManager, id } = await UserService.getUser({ id: req.request.UserId });
    // CREATE NOTIFICATION FOR THE REQUESER OR MANAGER
    const userId = (lineManager === req.userData.userId) ? id : lineManager;
    const notification = await NotificationService.createNotification({
      modelName: 'Comments',
      modelId: newComment.get({ plain: true }).id,
      type: 'new_comment',
      userId,
    });
    // EMITTING ECHO FOR NEW NOTIFICATION
    NotificationUtil.echoNotification(req, notification, 'new_comment', userId);
    sendResult(res, 201, 'Comment Created', newComment);
  },
  viewComment: async (req, res) => {
    const comments = await db.Requests.findOne({
      where: { id: req.params.requestId },
      attributes: { exclude: ['updatedAt'] },
      include: [{
        model: db.Comments,
        attributes: { exclude: ['id', 'updatedAt', 'requestId', 'userId', 'deletedAt'] },
        include: [{
          model: db.Users, attributes: ['fullname']
        }]
      }]
    });
    sendResult(res, 201, '', comments);
  },
  updateComment: async (req, res) => {
    await CommentService.updateComment(req.params.commentId, req.body.comment);
    sendResult(res, 200, 'Comment Updated Successful');
  },
  trashComment: async (req, res) => {
    await CommentService.trashComment(req.params.commentId);
    sendResult(res, 200, 'Comment Deleted Successful');
  }
};


export default CommentsController;
