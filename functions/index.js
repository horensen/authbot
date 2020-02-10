'use strict';

const functions = require('firebase-functions');
const {WebhookClient, Card, Suggestion} = require('dialogflow-fulfillment');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({request, response});
  const {headers, body} = request;
  const {queryResult} = body;
  const {outputContexts, parameters} = queryResult;
  const {authorization} = headers;
  const requestIsAuthorized = authorization === 'XXX';

  const txnContextParams = getContextParameters('txn_mode');
  const userIsAuthenticated = txnContextParams.auth || false;
  const userHasProvidedEmail = txnContextParams.email || false;
  const currentRequest = txnContextParams.currentRequest || null;

  // ---------------------------------------------------------------------------------------------------------------------

  function welcome (agent) {
    agent.add(`Hi. I'm AuthBot. In this demo, you'll provide a valid transactional request and I'll authenticate you before fulfilling it.`);
    agent.add(new Suggestion(`Change home address`));
    agent.add(new Suggestion(`Check parking charges`));
    agent.add(new Suggestion(`Pay season parking`));
  }

  // ---------------------------------------------------------------------------------------------------------------------

  function provideEmail (agent) {
    const {email} = parameters;

    if (email !== '') {
      if (!currentRequest) {
        agent.add(`Noted. How can I help?`);
        agent.add(new Suggestion(`Change home address`));
        agent.add(new Suggestion(`Check parking charges`));
        agent.add(new Suggestion(`Pay season parking`));
      } else if (!userIsAuthenticated) {
        agent.add(`Got it. A 6-digit OTP which has been sent to your mobile number ending with 88. What's the number?`);
      }
      updateContextParameters('txn_mode', {email});
    } else {
      agent.add(`What's your email address?`);
    }
  }

  function provideOTP (agent) {
    const {OTP} = parameters;

    if (OTP !== '') {
      if (userIsAuthenticated) {
        agent.add(`You are already authenticated. What transactions can I do for you?`);
      } else if (!userIsAuthenticated && !currentRequest) {
        agent.add(`How can I assist you?`);
        // do not say "you are not authorised" even though the user has not authenticated yet because it's unfriendly
      } else if (authenticateUser(txnContextParams.email, OTP)) {
        if (currentRequest === 'update_home_address') {
          const {newAddress} = txnContextParams;
          agent.add(`You'd like to update your home address to "${newAddress.toUpperCase()}". Is that right?`);
          agent.add(new Suggestion(`Yes`));
          agent.add(new Suggestion(`No`));
          updateContextParameters('txn_mode', {auth: true});
        }
      } else {
        agent.add(`Sorry, I cannot proceed with your request because the email and OTP combination is wrong.`);
        agent.add(new Suggestion('Try another email'));
        agent.add(new Suggestion('Try another OTP'));
      }
    } else {
      agent.add(`What's the OTP?`);
    }
  }

  function changeHomeAddress (agent) {
    const {address} = parameters;

    if (address !== '') {
      if (userIsAuthenticated) {
        agent.add(`You'd like to update your home address to "${address.toUpperCase()}". Is that right?`);
      } else if (userHasProvidedEmail) {
        agent.add(`Before I update your home address, I'll just need to authenticate you. A 6-digit OTP has been sent to your mobile number ending with 88. What's the number?`);
      } else {
        agent.add(`Before I update your home address, I'll just need to authenticate you. What's your email address?`);
      }

      updateContextParameters('txn_mode', {
        currentRequest: 'update_home_address',
        newAddress: address
      });
    } else {
      agent.add(`What's your new home address?`);
    }
  }

  function yes (agent) {
    if (userIsAuthenticated && currentRequest === 'update_home_address') {
      const {newAddress} = txnContextParams;
      agent.add(`OK. Your new home address on file is now "${newAddress.toUpperCase()}".`);
    } else {
      agent.add('Alright.');
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------

  function getContextParameters (contextName) {
    const filteredOutputContexts = outputContexts.filter(oc => oc.name.includes(contextName.toLowerCase()));
    if (filteredOutputContexts && filteredOutputContexts[0] && filteredOutputContexts[0].parameters) {
      return filteredOutputContexts[0].parameters;
    }
    return {};
  };

  function updateContextParameters (contextName, newParams) {
    const currentParams = getContextParameters(contextName);
    const [name, lifespan] = [contextName, 5];

    if (Object.keys(currentParams).length === 0) { // currentParams is {}
      agent.context.set({name, lifespan, parameters: newParams});
    } else {
      agent.context.set({name, lifespan, parameters: {...currentParams, ...newParams}});
    }
  }

  function authenticateUser (email, OTP) {
    return email === 'tester@gmail.com' && OTP === '123456'; // Assume that authentication is a success
  }

  if (requestIsAuthorized) {
    let intentMap = new Map();
    intentMap.set('Greeting', welcome);
    intentMap.set('Provide email', provideEmail);
    intentMap.set('Provide OTP', provideOTP);
    intentMap.set('Transactional Request 1 - Change home address', changeHomeAddress);
    intentMap.set('Yes', yes);
    agent.handleRequest(intentMap);
  }
});
