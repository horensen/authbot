'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const intents = require('./intents');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({request, response});
  const {headers} = request;
  const {authorization} = headers;
  const requestIsAuthorized = authorization === process.env.AUTH_TOKEN;

  if (requestIsAuthorized) {
    let intentMap = new Map();
    intentMap.set('Greeting', intents.greeting(request));
    intentMap.set('Transactional Request 1 - Change home address', intents.changeHomeAddress(request));
    intentMap.set('Transactional Request 2 - Enquire parking charges', intents.enquireParkingCharges(request));
    // intentMap.set('Transactional Request 3 - Pay outstanding charges', intents.payOutstandingCharges(request));
    intentMap.set('Provide email', intents.provideEmail(request));
    intentMap.set('Provide OTP', intents.provideOTP(request));
    intentMap.set('Yes', intents.yes(request));
    agent.handleRequest(intentMap);
  }
});
