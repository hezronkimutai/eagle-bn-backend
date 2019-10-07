import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const setupSwagger = (app, address) => {
  const swaggerDefinition = {
    info: {
      title: 'Barefoot Nomad',
      version: '1.0.0',
      description: 'Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.',
    },
    host: `localhost:${address.port}`,
    basePath: '/api/v1',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  };
  const options = {
    swaggerDefinition,
    apis: ['./src/routes/**/*.js', './src/database/models/**/*.js'],
  };
  const swaggerSpec = swaggerJsdoc(options);

  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
export default setupSwagger;
