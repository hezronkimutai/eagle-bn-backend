/* eslint-disable no-useless-escape */
/* eslint-disable array-callback-return */
/* eslint-disable no-prototype-builtins */
import moment from 'moment-timezone';
import Check from '../utils/validator';
import sendResult from '../utils/sendResult';
import { checkStringInArray, checkDate, checkCountry } from './trips';
import currencies from '../utils/currencies.json';

const isNumeric = (num, name, res, next) => {
  if (num.match(/^[0-9]{1,}$/)) return next();
  return sendResult(res, 400, `${name} should be integer`);
};

const validator = {
  profile(req, res, next) {
    try {
      new Check({ fullname: req }).str().alphaNum();
      new Check({ password: req }).str().withSpec().confirm();
      new Check({ gender: req }).str().gender();
      new Check({ dob: req }).str().alphaNum();
      new Check({ address: req }).str().min(2);
      new Check({ city: req }).str().alpha();
      new Check({ state: req }).str().alpha();
      new Check({ department: req }).str().alpha();
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  signup(req, res, next) {
    try {
      new Check({ email: req }).req().email();
      new Check({ fullname: req }).req().min(2).alpha();
      new Check({ password: req }).req().withSpec().min(8)
        .confirm();
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  accommodation(req, res, next) {
    try {
      new Check({ name: req }).str().req().min(5);
      new Check({ description: req }).str().req().min(5);
      new Check({ address: req }).str().req().min(5);
      new Check({ availableSpace: req }).str().req().min(5);
      new Check({ cost: req }).req().double();
      new Check({ currency: req }).str().eql(3);
      new Check({ services: req }).str().req().min(5);
      new Check({ amenities: req }).str().req().min(5);
      req.body.cost = parseFloat(req.body.cost);
      if (req.body.currency) {
        const found = Object.keys(currencies)
          .find(element => element === req.body.currency.toLocaleUpperCase());
        if (!found) throw new Error('Unsupported Currency');
        req.body.currency = req.body.currency.toLocaleUpperCase();
      }
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  tripValidation(req, res, next) {
    let { status } = req.params;
    status = status.toLowerCase();
    if (status !== 'approve' && status !== 'reject') {
      return sendResult(res, 400, 'invalid request');
    }
    if (status === 'approve') req.params.status = 'approved';
    if (status === 'reject') req.params.status = 'rejected';
    return next();
  },

  singleReqValid(req, res, next) {
    return isNumeric(req.params.requestId, 'request Id', res, next);
  },

  managerValid(req, res, next) {
    return isNumeric(req.params.managerId, 'manager Id', res, next);
  },

  request(req, res, next) {
    req.error = {};
    try {
      new Check({ timeZone: req }).str().req().min(1);
      new Check({ trips: req }).array().req().min(1);
      new Check({ country: req }).str().req().min(2);
      new Check({ city: req }).str().req().min(1);
      // VALIDATE USER'S TIMEZONE
      const validTZ = checkStringInArray(moment.tz.names(), req.body.timeZone, 10);
      if (validTZ instanceof Array) {
        req.error.timeZone = JSON.stringify(['did you mean?', validTZ]);
        throw new Error();
      }
      // VALIDATE RETURNTIME
      if (req.body.returnDate) {
        checkDate(req, req.body.returnDate, req.body.timeZone);
      }
      // VALIDATE COUNTRY
      const country = checkCountry(req.body.country);
      if (!country) {
        req.error.country = 'invalid country';
      } else {
        req.body.country = country;
      }
      next();
    } catch (err) {
      const message = (Object.keys(req.error).length === 0) ? err.message : req.error;
      return sendResult(res, 400, message);
    }
  },

  searchValidate(req, res, next) {
    try {
      new Check({ description: req }).str().min(1);
      new Check({ UserId: req }).num();
      new Check({ destination: req }).str();
      new Check({ origin: req }).str();
      new Check({ duration: req }).str().min(5);
      new Check({ status: req }).str().min(5);
      new Check({ departureTime: req }).str();
      new Check({ id: req }).num();
      const {
        id, origin, UserId, status, destination, reason,
        departureTime, from, to, returnTime,
      } = req.query;
      const allData = { id,
        origin,
        UserId,
        status,
        destination,
        reason,
        departureTime,
        from,
        to,
        returnTime };
      Object.keys(req.query).map(key => {
        if (!allData.hasOwnProperty(key) || !allData[key]) {
          throw new Error(`${key} is invalid parameter`);
        }
      });
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  editAccommodation(req, res, next) {
    try {
      new Check({ name: req }).str().min(5);
      new Check({ description: req }).str().min(5);
      new Check({ address: req }).str().min(5);
      new Check({ availableSpace: req }).str().min(5);
      new Check({ cost: req }).double();
      new Check({ services: req }).str().min(5);
      new Check({ amenities: req }).str().min(5);
      new Check({ currency: req }).str().eql(3);
      if (req.body.currency) {
        const found = Object.keys(currencies)
          .find(element => element === req.body.currency.toLocaleUpperCase());
        if (!found) throw new Error('Unsupported Currency');
        req.body.currency = req.body.currency.toLocaleUpperCase();
      }
      if (req.body.cost) {
        req.body.cost = parseFloat(req.body.cost);
      }
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  addCommentValidation: async (req, res, next) => {
    const { requestId } = req.params;
    try {
      new Check({ comment: req }).str().req().min(5);
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
    if (!requestId.match(/^[0-9]{1,}$/)) return sendResult(res, 400, 'requestId should be a number');
    next();
  },
  viewCommentValidation: async (req, res, next) => {
    const { requestId } = req.params;
    if (!requestId.match(/^[0-9]{1,}$/)) return sendResult(res, 400, 'requestId should be a number');
    next();
  },
  reviewValidation: async (req, res, next) => {
    try {
      new Check({ rating: req }).integer().req();
      new Check({ feedback: req }).str().req();
      const rate = Number.parseInt(req.body.rating, 10);
      if (!(rate >= 0 && rate <= 5)) return sendResult(res, 400, 'the rating should be between 0 and 5');
      return isNumeric(req.params.id, 'booking id', res, next);
    } catch (err) {
      return sendResult(res, 400, err.message);
    }
  },
  reviewDateValidation(req, res, next) {
    const { booking } = req;
    if (booking.start < Date.now()) return next();
    return sendResult(res, 400, 'You can\'t review an accommodation before your booking starting date');
  },
  accommodationId(req, res, next) {
    return isNumeric(req.params.accommodationId, 'accommodation Id', res, next);
  },

  updateRequest(req, res, next) {
    const { returnTime } = req.body;
    const { departureTime } = req.body.trip;
    try {
      new Check({ timeZone: req }).str().min(1);
      new Check({ trips: req }).array().min(1);
      new Check({ country: req }).str().min(2);
      new Check({ city: req }).str().min(1);
      new Check({ requestId: req }).num().min(1);
      new Check({ tripId: req }).num().min(1);
      new Check({ returnTime: req }).date();
      if (returnTime || departureTime) {
        req.body.timeZone = new Date(returnTime || departureTime).toString().split('(')[1].replace(/[\(\)]/g, '');
      }
      next();
    } catch (err) {
      return sendResult(res, 400, err.message);
    }
  },
  getChats(req, res, next) {
    try {
      new Check({ offset: req }).integer();
      new Check({ limit: req }).integer();
      next();
    } catch (err) {
      return sendResult(res, 400, err.message);
    }
  },
  addChats(req, res, next) {
    try {
      new Check({ message: req }).req().str();
      new Check({ receiverId: req }).integer();
      next();
    } catch (err) {
      return sendResult(res, 400, err.message);
    }
  },

  editCommentValidation: async (req, res, next) => {
    const { requestId, commentId } = req.params;
    try {
      new Check({ comment: req }).str().req().min(5);
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
    if (!requestId.match(/^[0-9]{1,}$/)) return sendResult(res, 400, 'requestId should be a number');

    if (!commentId.match(/^[0-9]{1,}$/)) return sendResult(res, 400, 'commentId should be a number');

    next();
  },
  deleteCommentValidation: async (req, res, next) => {
    const { requestId, commentId } = req.params;

    if (!requestId.match(/^[0-9]{1,}$/)) return sendResult(res, 400, 'requestId should be a number');

    if (!commentId.match(/^[0-9]{1,}$/)) return sendResult(res, 400, 'commentId should be a number');

    next();
  },

  getBookingValidation(req, res, next) {
    return isNumeric(req.params.id, 'Booking ID', res, next);
  },

  validateBooking(req, res, next) {
    try {
      new Check({ accommodationId: req }).num().req();
      new Check({ tripId: req }).num().req();
      new Check({ numberOfSpace: req }).num().req();
      new Check({ start: req }).dateGreaterThan(Date.now()).req();
      new Check({ end: req }).dateGreaterThan(new Date(req.body.start)).req();
      req.body.TripId = req.body.tripId;
      req.body.AccommodationId = req.body.accommodationId;
      next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  },

  stats(req, res, next) {
    try {
      new Check({ weeks: req }).num().min(1);
      new Check({ months: req }).num().min(1);
      new Check({ years: req }).num().min(1);
      new Check({ days: req }).num().min(1);
      const { weeks, months, years, days } = req.query;
      const period = { weeks, months, years, days };
      Object.keys(req.query).map(key => {
        if (!key || !period[key]) {
          throw new Error(`${key} is an invalid parameter`);
        }
      });
      if (Object.keys(req.query).length > 1) {
        throw new Error('you can provide one query at a time');
      }
      return next();
    } catch (error) {
      return sendResult(res, 400, error.message);
    }
  }
};

export default validator;
