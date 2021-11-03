const mongoose = require('mongoose');
const connectionString = process.env.DB_HOST
    .replace('<user>', process.env.DB_USER)
    .replace('<password>', process.env.DB_PASS);

mongoose.connect(connectionString)
    .then(() => {
        console.log('Mongo DB connected');
    }).catch(err => {
        console.error(err);
    });
