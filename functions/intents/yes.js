const {
  getContextParameters,
  updateContextParameters,
  showButtons
} = require('../agent-helper');
const {
  okay,
  acknowledgeSuccessfulHomeAddressUpdate,
  answerParkingChargeEnquiry
} = require('../en_replies');
const {
  EN_TRANSACTION_OPTIONS
} = require('../en_options');
const {
  TRANSACTION_MODE
} = require('../contexts');

const yes = request => {

  // Get parameters from context
  const txnContextParams = getContextParameters(request, TRANSACTION_MODE);
  const userIsAuthenticated = txnContextParams.auth || false;
  const currentRequest = txnContextParams.currentRequest || null;
  const requestIsChangeHomeAddress = currentRequest === `update_home_address`;
  const requestIsParkingChargeEnquiry = currentRequest === `enquire_parking_charges`;

  const handleIntent = agent => {
    if (userIsAuthenticated) {

      if (requestIsChangeHomeAddress) {
        // Assume that updating of home address is validated and successful.
        agent.add(acknowledgeSuccessfulHomeAddressUpdate(txnContextParams.address));
        showButtons(agent, EN_TRANSACTION_OPTIONS);
        updateContextParameters(request, agent, TRANSACTION_MODE, { currentRequest: null });
      }

      else if (requestIsParkingChargeEnquiry) {
        const {vehicle, address} = txnContextParams;

        // Assume that params are validated and parking charge amount is already retrieved.
        const parkingChargeAmount = `$80.00`;
        agent.add(answerParkingChargeEnquiry(vehicle, address, parkingChargeAmount));
        showButtons(agent, EN_TRANSACTION_OPTIONS);
        updateContextParameters(request, agent, TRANSACTION_MODE, { currentRequest: null });
      }

    } else {

      agent.add(okay);

    }
  };

  return handleIntent;
};

module.exports = yes;
