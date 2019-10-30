import db from '../database/models/index';
import sendResult from '../utils/sendResult';

const comment = {
  addComment: async (req, res) => {
    const newComment = await db.Comments.create({
      comment: req.body.comment,
      userId: req.userData.userId,
      requestId: req.params.requestId,
    });
    sendResult(res, 201, 'Comment Created', newComment);
  },
  viewComment: async (req, res) => {
    const comments = await db.Requests.findOne({
      where: { id: req.params.requestId },
      include: [{
        model: db.Comments, attributes: { exclude: ['createdAt', 'updatedAt'] }
      }]
    });
    sendResult(res, 201, '', comments);
  }
};


export default comment;
