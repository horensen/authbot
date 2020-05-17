const {
  getContextParameters,
  updateContextParameters
} = require('../agent-helper');
const {
  TRANSACTION_MODE
} = require('../contexts');
const {
  homeAddressUpdateConfirmation,
  promptOtpForAuth,
  promptEmailForAuth,
  promptNewHomeAddress
} = require('../en_replies');

const changeHomeAddress = request => {
  const {body} = request;
  const {queryResult} = body;
  const {parameters} = queryResult;

  // Get parameters from slot filling
  const {slot_address} = parameters;

  // Get parameters from context
  const txnContextParams = getContextParameters(request, TRANSACTION_MODE);
  const userIsAuthenticated = txnContextParams.auth || false;
  const userHasProvidedEmail = txnContextParams.email || false;

  // Take values from slot filling, or otherwise from existing transaction context, to set in context later
  let address = slot_address || txnContextParams.address;
  const currentRequest = `update_home_address`;

  const handleIntent = agent => {

    if (address & userIsAuthenticated) {
      agent.add(homeAddressUpdateConfirmation(address));
    }

    else if (address) {
      if (userHasProvidedEmail) {
        agent.add(promptOtpForAuth(txnContextParams.email));
      } else {
        agent.add(promptEmailForAuth);
      }
    }

    else {
      agent.add(promptNewHomeAddress);
    }

    updateContextParameters(request, agent, TRANSACTION_MODE, { currentRequest, address });
  };

  return handleIntent;
};

module.exports = changeHomeAddress;
