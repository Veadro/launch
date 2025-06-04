const express = require('express');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

// Load routes
app.use('/data', require('./api/data'));
app.use('/commands', require('./api/commands'));

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Launch Server API',
      version: '1.0.0'
    }
  },
  apis: [path.join(__dirname, './api/*.js')]
};
const openapiSpecification = swaggerJSDoc(options);

// Write openapi.yaml during startup
const yaml = require('js-yaml');
fs.writeFileSync(path.join(__dirname, '../openapi.yaml'), yaml.dump(openapiSpecification), 'utf8');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
