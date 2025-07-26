// filepath: /workspaces/cloudops-practice/backend/src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CloudOps Practice API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], // Đường dẫn tới các file route để tự động sinh docs
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;