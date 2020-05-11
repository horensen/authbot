const {Suggestion} = require('dialogflow-fulfillment');
const {
  updateContextParameters,
  authenticateUser,
  getContextParameters
} = require('../agent-helper');

const EN_PROMPT_OTP = `What's the OTP?`;
const EN_AUTH_FAILURE = `Sorry, I cannot proceed with your request because the email and OTP combination is wrong.`;
const EN_AUTH_RETRY_OPTIONS = [`Try another email`, `Try another OTP`];
const EN_PROMPT_REQUEST_AFTER_REPEATED_AUTH = `You are already authenticated. What transactions can I do for you?`;
const EN_PROMPT_REQUEST = `How can I assist you?`;
const EN_PROMPT_HOME_ADDRESS_UPDATE_CONFIRMATION = [`You'd like to update your home address to "`, `". Is that right?`];
const EN_CONFIRMATION_OPTIONS = [`Yes`, `No`];

const provideOTP = request => {
  const {body} = request;
  const {queryResult} = body;

  // Get parameters from slot filling
  const {parameters} = queryResult;
  const {OTP} = parameters;
  const otpIsSaid = OTP !== '';

  // Get parameters from context
  const txnContextParams = getContextParameters(request, 'transaction_mode');
  const {email, newAddress} = txnContextParams;
  const userIsAuthenticated = txnContextParams.auth || false;
  const currentRequest = txnContextParams.currentRequest || null;
  const requestIsUpdateHomeAddress = currentRequest === 'update_home_address';

  const handleIntent = agent => {
    if (otpIsSaid) {
      if (userIsAuthenticated) {
        agent.add(EN_PROMPT_REQUEST_AFTER_REPEATED_AUTH);
      } else if (!userIsAuthenticated && !currentRequest) {
        agent.add(EN_PROMPT_REQUEST);
      } else if (authenticateUser(email, OTP)) {
        if (requestIsUpdateHomeAddress) {
          const [part1, part2] = EN_PROMPT_HOME_ADDRESS_UPDATE_CONFIRMATION;
          agent.add(`${part1}${newAddress.toUpperCase()}${part2}`);
          EN_CONFIRMATION_OPTIONS.forEach(option => agent.add(new Suggestion(option)));
          updateContextParameters(request, agent, 'transaction_mode', {auth: true});
        }
      } else {
        agent.add(EN_AUTH_FAILURE);
        EN_AUTH_RETRY_OPTIONS.forEach(option => agent.add(new Suggestion(option)));
      }
    } else {
      agent.add(EN_PROMPT_OTP);
    }
  };

  return handleIntent;
};

module.exports = provideOTP;
