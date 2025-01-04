// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  info: {
    title: "My API",
    version: "1.0.0",
    description: "My API documentation",
  },
  basePath: "/",
};

const options = {
  swaggerDefinition,
  apis: ["./server.js"], // Таны API маршруттай холбоотой файлыг энд зааж өгнө
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
