const mung = require('express-mung');

const isSuccessful = (body, req, res) => {
    console.log(body)
    if (body) {
        body.success = (body.error || body.errors) ? false : true;
    }

    return body;
}

module.exports = mung.json(isSuccessful);
