const mung = require('express-mung');

const isSuccessful = (body, req, res) => {
    if (body) {
        body.success = (body.error || body.errors) ? false : true;
    }

    return body;
};

module.exports = mung.json(isSuccessful);
