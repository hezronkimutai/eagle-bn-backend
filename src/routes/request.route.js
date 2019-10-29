import express from 'express';
import RequestController from '../controllers/requests.controller';
import valid from '../validation';
import { validateTrips, validateAccommodation } from '../validation/trips';
import RequestMiddleware from '../middlewares/request.middleware';
import UserMiddleware from '../middlewares/user.middleware';
import RoleMiddleware from '../middlewares/role.middleware';
import CommentsController from '../controllers/comments.controller';

const app = express.Router();

const { checkExistingTrip, checkLineManager, checkManagerId, checkTripOwner } = RequestMiddleware;
const { changeRequestStatus, getManagerRequests } = RequestController;
const { checkManager, checkRequester } = RoleMiddleware;
const { checkToken } = UserMiddleware;
const {
  addCommentValidation,
  viewCommentValidation,
  tripValidation,
  singleReqValid,
  managerValid
} = valid;
const { addComment, viewComment } = CommentsController;


app.get('/:requestId', singleReqValid, checkToken, checkExistingTrip, checkTripOwner, RequestController.getSingleRequest);
app.get('/', checkToken, checkRequester, RequestController.getRequest);
/* eslint-disable max-len */
app.post('/', checkToken, checkRequester, valid.request, validateTrips, validateAccommodation, RequestController.postRequest);
app.get('/managers/:managerId', managerValid, checkToken, checkManager, checkManagerId, getManagerRequests);
app.patch('/:requestId/:status', singleReqValid, checkToken, checkManager, checkExistingTrip, checkLineManager, tripValidation, changeRequestStatus);
app.post('/:requestId/comments', addCommentValidation, checkToken, checkExistingTrip, checkTripOwner, addComment);
app.get('/:requestId/comments', viewCommentValidation, checkToken, checkExistingTrip, checkTripOwner, viewComment);
export default app;
