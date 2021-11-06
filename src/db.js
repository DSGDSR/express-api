const mongoose = require('mongoose');
const connectionString = process.env.NODE_ENV === 'test' ?
    process.env.DB_TEST_URI : process.env.DB_HOST.replace('<user>', process.env.DB_USER).replace('<password>', process.env.DB_PASS);

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(connectionString)
        .then(() => {
            console.log('Mongo DB connected');
        }).catch(err => {
            console.error(err);
        });
}
