const { getContextParameters, updateContextParameters } = require('../agent-helper');

const EN_PROMPT_ADDRESS = `What's your new home address?`;
const EN_PROMPT_CONFIRMATION = [`You'd like to update your home address to "`, `". Is that right?`];
const EN_PROMPT_OTP = `Before I update your home address, I'll just need to authenticate you. A 6-digit OTP has been sent to your mobile number ending with 88. What's the number?`;
const EN_PROMPT_EMAIL = `Before I update your home address, I'll just need to authenticate you. What's your email address?`;

const changeHomeAddress = request => {
  const {body} = request;
  const {queryResult} = body;
  const {parameters} = queryResult;
  const {address} = parameters;

  // Get parameters from slot filling
  const addressIsSaid = address !== '';

  // Get parameters from context
  const txnContextParams = getContextParameters(request, 'transaction_mode');
  const userIsAuthenticated = txnContextParams.auth || false;
  const userHasProvidedEmail = txnContextParams.email || false;

  const handleIntent = agent => {

    if (addressIsSaid) {
      if (userIsAuthenticated) {
        const [part1, part2] = EN_PROMPT_CONFIRMATION;
        agent.add(`${part1}${address.toUpperCase()}${part2}`);
      } else if (userHasProvidedEmail) {
        agent.add(EN_PROMPT_OTP);
      } else {
        agent.add(EN_PROMPT_EMAIL);
      }

      updateContextParameters(request, agent, 'transaction_mode', {
        currentRequest: 'update_home_address',
        newAddress: address
      });
    } else {
      agent.add(EN_PROMPT_ADDRESS);
    }
  };

  return handleIntent;
};

module.exports = changeHomeAddress;
