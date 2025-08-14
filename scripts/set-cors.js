const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../path-to-your-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'pillarx-bim.firebasestorage.app'
});

const bucket = admin.storage().bucket();

// Set CORS configuration
const corsConfiguration = [
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    maxAgeSeconds: 3600,
    responseHeader: ['Content-Type', 'Access-Control-Allow-Origin']
  }
];

bucket.setCorsConfiguration(corsConfiguration)
  .then(() => {
    console.log('CORS configuration updated successfully');
  })
  .catch((error) => {
    console.error('Error updating CORS configuration:', error);
  }); 