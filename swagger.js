const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const port = process.env.PORT || 8080;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chiritour Api Rest',
      version: '1.0.0',
      description: 'Documentación de la API con Swagger',
    },
    servers: [
      {
        url: `https://chiritour.azurewebsites.net`, 
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
