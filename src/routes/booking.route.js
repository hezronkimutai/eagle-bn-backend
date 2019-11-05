import express from 'express';
import BookingsController from '../controllers/bookings.controller';
import BookingMiddleware from '../middlewares/booking.middleware';
import UserMiddleware from '../middlewares/user.middleware';
import validation from '../validation';
import AccommodationMiddleware from '../middlewares/accommodation.middleware';
import RequestMiddleware from '../middlewares/request.middlware';

const app = express.Router();

const { checkToken } = UserMiddleware;
const { checkUserBooking, bookingExist } = BookingMiddleware;
const { setAccommodationRating, createBooking, getBooking } = BookingsController;
const {
  reviewDateValidation, reviewValidation, validateBooking, getBookingValidation
} = validation;
const { checkIfTripExists, checkTripOwner } = RequestMiddleware;
const { accommodationExists, isAccommodationAvailable } = AccommodationMiddleware;

app.patch('/:id/rate', reviewValidation, checkToken, checkUserBooking, reviewDateValidation, setAccommodationRating);
app.post(
  '/', checkToken, validateBooking,
  accommodationExists, isAccommodationAvailable, checkIfTripExists, checkTripOwner,
  createBooking
);
app.get('/:id', checkToken, getBookingValidation, bookingExist, checkUserBooking, getBooking);

export default app;
