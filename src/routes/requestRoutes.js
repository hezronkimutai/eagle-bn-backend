import express from 'express';
import requestsController from '../controllers/requests.controller';
import valid from '../validation';
import { validateTrips, validateAccommodation } from '../validation/trips';
import reqMidd from '../middlewares/requestMiddlware';
import userMidd from '../middlewares/userMiddlware';
import roles from '../middlewares/rolesMiddlewares';
import comment from '../controllers/commentController';

const app = express.Router();

const { checkExistingTrip, checkLineManager, checkManagerId, checkTripOwner } = reqMidd;
const {
  changeRequestStatus,
  getManagerRequests,
  getSingleRequest,
  postRequest,
  getRequest } = requestsController;
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

app.get('/:requestId', singleReqValid, checkToken, checkExistingTrip, checkTripOwner, getSingleRequest);
app.get('/', checkToken, checkRequester, getRequest);
/* eslint-disable max-len */
app.post('/', checkToken, checkRequester, valid.request, validateTrips, validateAccommodation, postRequest);
app.get('/managers/:managerId', managerValid, checkToken, checkManager, checkManagerId, getManagerRequests);
app.patch('/:requestId/:status', singleReqValid, checkToken, checkManager, checkExistingTrip, checkLineManager, tripValidation, changeRequestStatus);
app.post('/:requestId/comments', addCommentValidation, checkToken, checkExistingTrip, checkTripOwner, addComment);
app.get('/:requestId/comments', viewCommentValidation, checkToken, checkExistingTrip, checkTripOwner, viewComment);
export default app;
