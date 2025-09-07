const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "To use Swagger, click on the link and select the deployed server from the Servers dropdown.\nFor authorized endpoints, you need to add a token to the header. To do this, execute the login API once, copy the token from the response, and paste it into the Authorize button at the top-right corner of the page.\nAll data for testing is provided as placeholders that you can use.",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Local server",
    },
    {
      url: "https://project.sppice.me/",
      description: "Deployed server",
    }
  ],
};


const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

