const {
  getContextParameters,
  updateContextParameters,
  showButtons
} = require('../agent-helper');
const {
  EN_TRANSACTION_OPTIONS
} = require('../en_options');
const {
  TRANSACTION_MODE
} = require('../contexts');
const {
  howCanIHelp,
  promptEmail,
  promptOtpForAuth,
  acknowledgeEmail
} = require('../en_replies');

const provideEmail = request => {
  const {body} = request;
  const {queryResult} = body;
  const {parameters} = queryResult;

  // Get parameters from slot filling
  const {slot_email} = parameters;

  // Get parameters from context
  const txnContextParams = getContextParameters(request, TRANSACTION_MODE);
  const userIsAuthenticated = txnContextParams.auth || false;
  const currentRequest = txnContextParams.currentRequest || null;

  // Take values from slot filling, or otherwise from existing transaction context, to set in context later
  const email = slot_email || txnContextParams.email;

  const handleIntent = agent => {

    if (email) {

      if (!currentRequest) {
        agent.add(acknowledgeEmail(email));
        agent.add(howCanIHelp);
        showButtons(agent, EN_TRANSACTION_OPTIONS);
      }

      else if (!userIsAuthenticated) {
        agent.add(promptOtpForAuth(email));
      }

    } else {

      agent.add(promptEmail);

    }

    updateContextParameters(request, agent, TRANSACTION_MODE, {email});
  };

  return handleIntent;
};

module.exports = provideEmail;
