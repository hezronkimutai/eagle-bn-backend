import express from 'express';
import UserRouter from './user.route';
import AccommodationRouter from './accommodation.route';
import RequestRouter from './request.route';

const app = express.Router();

app.use('/users', UserRouter);
app.use('/accommodations', AccommodationRouter);
app.use('/requests', RequestRouter);

export default app;
