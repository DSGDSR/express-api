// express and api dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// get env variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, `../env/${process.env.NODE_ENV.trim()}.env`)});

// defining express app
const app = express();

// Helmet     => enhance API's security
// BodyParser => parse JSON bodies into JS objects
// Morgan     => log HTTP requests
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('combined'));

// enabling CORS for all requests
app.use(cors());

// swagger UI
const swagger = require('swagger-ui-express'),
      swaggerConfig = require('./swagger.js');
app.use('/docs', swagger.serve, swagger.setup(swaggerConfig));

// starting express server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
