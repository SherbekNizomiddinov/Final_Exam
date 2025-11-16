const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Cyber E-commerce API',
    version: '1.0.0',
    description: 'Complete API documentation for Cyber Apple Store e-commerce platform',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      Bearer: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {},
};

module.exports = swaggerDocs;
