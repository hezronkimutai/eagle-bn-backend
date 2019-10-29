import express from 'express';
import requestController from '../controllers/requests.controller';
import valid from '../validation';
import { validateTrips, validateAccommodation } from '../validation/trips';
import reqMidd from '../middlewares/request.middlware';
import userMidd from '../middlewares/user.middlware';
import roles from '../middlewares/role.middleware';
import comment from '../controllers/comments.controller';

const app = express.Router();

const { checkExistingTrip, checkLineManager, checkManagerId, checkTripOwner } = reqMidd;
const { changeRequestStatus, getManagerRequests } = requestController;
const { checkManager, checkRequester } = roles;
const { checkToken } = userMidd;
const {
  addCommentValidation,
  viewCommentValidation,
  tripValidation,
  singleReqValid,
  managerValid
} = valid;
const { addComment, viewComment } = comment;

app.get('/:requestId', singleReqValid, checkToken, checkExistingTrip, checkTripOwner, requestController.getSingleRequest);
app.get('/', checkToken, checkRequester, requestController.getRequest);
/* eslint-disable max-len */
app.post('/', checkToken, checkRequester, valid.request, validateTrips, validateAccommodation, requestController.postRequest);
app.get('/managers/:managerId', managerValid, checkToken, checkManager, checkManagerId, getManagerRequests);
app.patch('/:requestId/:status', singleReqValid, checkToken, checkManager, checkExistingTrip, checkLineManager, tripValidation, changeRequestStatus);
app.post('/:requestId/comments', addCommentValidation, checkToken, checkExistingTrip, checkTripOwner, addComment);
app.get('/:requestId/comments', viewCommentValidation, checkToken, checkExistingTrip, checkTripOwner, viewComment);
export default app;
