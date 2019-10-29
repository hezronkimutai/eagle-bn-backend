import express from 'express';
import userRouter from './user.route';
import accommodationRouter from './accommodation.route';
import requestRouter from './request.route';

const app = express.Router();

app.use('/users', userRouter);
app.use('/accommodations', accommodationRouter);
app.use('/requests', requestRouter);

export default app;
