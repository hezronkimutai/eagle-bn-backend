
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import setupSwagger from './utils/swaggerDefinition';
import routes from './routes/index';

const app = express();

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', routes);


const server = app.listen(process.env.PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${server.address().port}`);
});

setupSwagger(app, server.address());

// need to be added after app.use(routers) to handle request not found
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: `${req.method}=${req.protocol}://${req.hostname}${req.path} not found`,
  });
});
export default server;
