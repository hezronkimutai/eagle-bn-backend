
import express from 'express';
import RequestsController from '../controllers/requests.controller';
import valid from '../validation';
import { validateTrips, updateValidateTrips, validateTripsData } from '../validation/trips';
import reqMidd from '../middlewares/request.middlware';
import userMidd from '../middlewares/user.middleware';
import roles from '../middlewares/role.middlewares';
import comment from '../controllers/commentController';

const app = express.Router();


const {
  checkExistingTrip,
  checkLineManager,
  checkManagerId,
  checkCommentOwner,
  checkRequestOwner,
  checkIfReqExist,
  checkIfTripExists } = reqMidd;
const {
  changeRequestStatus,
  getManagerRequests,
  search,
  getRequests,
  getSingleRequest,
  postRequest,
  updateRequest } = RequestsController;

const { checkManager, checkRequester } = roles;
const { checkToken, verifyToken } = userMidd;
const {
  addCommentValidation,
  editCommentValidation,
  viewCommentValidation,
  deleteCommentValidation,
  tripValidation,
  singleReqValid,
  managerValid,
  searchValidate,
} = valid;
const { addComment, viewComment, updateComment, trashComment } = comment;


app.get('/search', verifyToken, searchValidate, search);
app.get('/:requestId', singleReqValid, checkToken, checkExistingTrip, checkRequestOwner, getSingleRequest);
app.get('/', checkToken, checkRequester, getRequests);
app.post('/', checkToken, checkRequester, valid.request, validateTrips, postRequest);
app.get('/managers/:managerId', managerValid, checkToken, checkManager, checkManagerId, getManagerRequests);
app.patch('/:requestId/:status', singleReqValid, checkToken, checkManager, checkExistingTrip, checkLineManager, tripValidation, changeRequestStatus);
app.put('/:requestId/:tripId', verifyToken, userMidd.getUserbyEmail, valid.updateRequest, checkIfReqExist, checkIfTripExists, updateValidateTrips, validateTripsData, updateRequest);
app.put('/:requestId/comments/:commentId', editCommentValidation, checkToken, checkExistingTrip, checkRequestOwner, checkCommentOwner, updateComment);
app.delete('/:requestId/comments/:commentId', deleteCommentValidation, checkToken, checkExistingTrip, checkRequestOwner, checkCommentOwner, trashComment);
app.post('/:requestId/comments', addCommentValidation, checkToken, checkExistingTrip, checkRequestOwner, addComment);
app.get('/:requestId/comments', viewCommentValidation, checkToken, checkExistingTrip, checkRequestOwner, viewComment);
export default app;
