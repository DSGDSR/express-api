const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Docs',
            version: '1.0.0',
        },
    },
    servers: [
        { 
            url: 'http://localhost:3001/',
            description: 'Local server'
        },
        { 
            url: 'https://music-api-dsgdsr.herokuapp.com/',
            description: 'Development server'
        }
    ],
    apis: [
        'src/routes/api/*.js'
    ]
};

module.exports = swaggerJsdoc(options);
