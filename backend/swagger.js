const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'FinPay  Scalable FinTech Wallet & Payment Backend',
    description: 'A scalable backend for PhonePe like  features (Auth, Send Money, History,wallet)',
  },
  host: 'localhost:5000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter token in format (Bearer <token>)'
    }
  },
  security: [ { bearerAuth: [] } ]
};



const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; // Root file is all that is needed

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger JSON generated!");
});