import express from 'express';
import userRouter from './userRoutes';

const app = express.Router();

app.use('/users', userRouter);

export default app;
