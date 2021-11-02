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
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('combined'));

// enabling CORS for all requests
app.use(cors());

// starting express server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
