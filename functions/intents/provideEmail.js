const {Suggestion} = require('dialogflow-fulfillment');
const {getContextParameters, updateContextParameters} = require('../agent-helper');

const EN_PROMPT_EMAIL = `What's your email address?`;
const EN_PROMPT_OTP = `Got it. A 6-digit OTP which has been sent to your mobile number ending with 88. What's the number?`;
const EN_PROMPT_REQUEST = `Noted your email address. How can I help?`
const EN_OPTIONS = [`Change home address`, `Check parking charges`, `Pay season parking`];

const provideEmail = request => {
  const {body} = request;
  const {queryResult} = body;

  // Get parameters from slot filling
  const {parameters} = queryResult;
  const {email} = parameters;
  const emailIsSaid = email !== '';

  // Get parameters from context
  const txnContextParams = getContextParameters(request, 'transaction_mode');
  const userIsAuthenticated = txnContextParams.auth || false;
  const currentRequest = txnContextParams.currentRequest || null;

  const handleIntent = agent => {
    if (emailIsSaid) {
      if (!currentRequest) {
        agent.add(EN_PROMPT_REQUEST);
        EN_OPTIONS.forEach(option => agent.add(new Suggestion(option)));
      } else if (!userIsAuthenticated) {
        agent.add(EN_PROMPT_OTP);
      }
      updateContextParameters(request, agent, 'transaction_mode', {email});
    } else {
      agent.add(EN_PROMPT_EMAIL);
    }
  };

  return handleIntent;
};

module.exports = provideEmail;
