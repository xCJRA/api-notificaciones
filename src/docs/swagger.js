const swaggerJsdoc  = require('swagger-jsdoc');
const swaggerUi     = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title:       'API de Notificaciones Multi-canal',
            version:     '1.0.0',
            description: 'API REST para envío de notificaciones por Email, WhatsApp y SMS. Construida con Node.js y Express.',
            contact: {
                name:  'César Reyes',
                url:   'https://github.com/xCJRA',
                email: 'cesarjreyesa1@gmail.com',
            },
        },
        servers: [
            { url: 'http://localhost:3000/api', description: 'Servidor local' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type:         'http',
                    scheme:       'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    // Lee las anotaciones JSDoc de las rutas para generar la doc
    apis: ['./src/routes/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };