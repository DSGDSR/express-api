const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Docs',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
