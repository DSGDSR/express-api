// get env variables and db
require('./env');
require('./db')

const isProduction = process.env.NODE_ENV === 'production';

// express and api dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// defining express app
const app = express();

// Helmet     => enhance API's security
// BodyParser => parse JSON bodies into JS objects
// Morgan     => log HTTP requests
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// enabling CORS for all requests
app.use(cors());

// swagger UI
const swagger = require('swagger-ui-express'),
      swaggerConfig = require('./swagger.js');
app.use('/docs', swagger.serve, swagger.setup(swaggerConfig));

// load mongo models
require('./models/User');
require('./models/Session');
require('./models/SongRequest');

// load routes
app.use(require('./routes'));

// error handler
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
} else {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: {}
    }});
  });
}

// starting express server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
