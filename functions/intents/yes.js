const {getContextParameters} = require('../agent-helper');

EN_HOME_ADDRESS_UPDATE_SUCCESS = [`Done. Your new home address on file is now "`, `".`];
EN_GENERAL_AGREEMENT = `Alright.`;

const yes = request => {

  // Get parameters from context
  const txnContextParams = getContextParameters(request, 'transaction_mode');
  const userIsAuthenticated = txnContextParams.auth || false;
  const currentRequest = txnContextParams.currentRequest || null;
  const requestIsUpdateHomeAddress = currentRequest === 'update_home_address';

  const handleIntent = agent => {
    if (userIsAuthenticated && requestIsUpdateHomeAddress) {
      const {newAddress} = txnContextParams;
      const [part1, part2] = EN_HOME_ADDRESS_UPDATE_SUCCESS;
      agent.add(`${part1}${newAddress.toUpperCase()}${part2}`);

      updateContextParameters(request, agent, 'transaction_mode', {
        currentRequest: null,
        address: newAddress
      });
    } else {
      agent.add(EN_GENERAL_AGREEMENT);
    }
  };

  return handleIntent;
};

module.exports = yes;
