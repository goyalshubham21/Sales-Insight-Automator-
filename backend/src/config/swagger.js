import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Sales Insight Automator API",
    version: "1.0.0",
    description: "API for uploading sales files, generating AI summaries, and emailing insights."
  },
  servers: [
    {
      url: "http://localhost:5000"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJSDoc(options);
