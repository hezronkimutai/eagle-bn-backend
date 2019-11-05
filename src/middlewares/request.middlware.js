import UserService from '../services/user.service';
import sendResult from '../utils/sendResult';
import RequestService from '../services/request.service';
import CommentService from '../services/comment.service';

const requestMidd = {
  async checkExistingTrip(req, res, next) {
    const { requestId } = req.params;
    const request = await RequestService.getOneRequest({ id: requestId });
    if (request) {
      req.request = request;
      return next();
    }
    return sendResult(res, 404, 'no request with such an id');
  },

  async checkLineManager(req, res, next) {
    const { request } = req;
    const { userData } = req;
    const user = await UserService.getUser({ id: request.UserId });
    if (user.lineManager === userData.userId) {
      req.user = user;
      return next();
    }
    return sendResult(res, 401, 'you are not managing this request');
  },

  async checkManagerId(req, res, next) {
    const { managerId } = req.params;
    const { userData } = req;
    if (userData.userId.toString() === managerId) return next();
    return sendResult(res, 401, 'you are not authorized');
  },

  async checkTripOwner(req, res, next) {
    const { userId } = req.userData;
    const { TripId } = req.body;
    const user = await RequestService.getTripOwner(TripId);
    if (user === userId) return next();
    return sendResult(res, 401, 'you are not authorized');
  },

  async checkRequestOwner(req, res, next) {
    const { request } = req;
    const { userId } = req.userData;
    const user = await UserService.getUser({ id: request.UserId });
    if (user.lineManager === userId || user.id === userId) return next();
    return sendResult(res, 401, 'you are not authorized');
  },

  async checkIfTripExists(req, res, next) {
    const condition = { id: req.params.tripId || req.body.TripId };
    const trip = await RequestService.getOnetrip(condition);
    if (trip) {
      req.trip = trip;
      return next();
    }
    return sendResult(res, 404, 'no trip with a given id found');
  },

  async checkIfReqExist(req, res, next) {
    const condition = { id: req.params.requestId, UserId: req.user.id, status: 'pending' };
    const request = await RequestService.getOneRequest(condition);
    if (!request) return sendResult(res, 404, 'request your trying to edit cannot be found');
    req.request = request.dataValues;

    next();
  },
  async checkCommentOwner(req, res, next) {
    const getComment = await CommentService.getComment(req.params.commentId);

    if (!getComment) return sendResult(res, 404, 'Comment does not exist');

    if (getComment.userId !== req.userData.userId) return sendResult(res, 401, 'You are not Authorized, You are not the owner of the comment');

    if (getComment.deletedAt !== null) return sendResult(res, 401, 'The Comment has already been deleted');

    next();
  }
};
export default requestMidd;
