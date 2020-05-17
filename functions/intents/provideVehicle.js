const {
  getContextParameters,
  updateContextParameters,
  showButtons
} = require('../agent-helper');
const {
  TRANSACTION_MODE
} = require('../contexts');
const {
  EN_YES_OR_NO,
  EN_TRANSACTION_OPTIONS,
  EN_VEHICLE_OPTIONS
} = require('../en_options');
const {
  promptOtpForAuth,
  promptEmailForAuth,
  parkingChargeEnquiryConfirmation,
  howCanIHelp,
  promptAddressOfVehicle,
  promptVehicle,
  acknowledgeVehicle
} = require('../en_replies');

const provideVehicle = request => {
  const {body} = request;
  const {queryResult} = body;
  const {parameters} = queryResult;

  // Get parameters from slot filling
  const {slot_vehicle} = parameters;

  // Get parameters from context
  const txnContextParams = getContextParameters(request, TRANSACTION_MODE);
  const userIsAuthenticated = txnContextParams.auth || false;
  const userHasProvidedEmail = txnContextParams.email || false;
  const currentRequest = txnContextParams.currentRequest || null;
  const requestIsParkingChargeEnquiry = currentRequest === `enquire_parking_charges`;

  // Take values from slot filling, or otherwise from existing transaction context, to set in context later
  const vehicle = slot_vehicle || txnContextParams.vehicle;
  const address = txnContextParams.address || ''; // additional related parameter

  const handleIntent = agent => {

    if (requestIsParkingChargeEnquiry) {

      if (userIsAuthenticated && address) {
        agent.add(parkingChargeEnquiryConfirmation(vehicle, address));
        showButtons(agent, EN_YES_OR_NO);
      }

      else if (userIsAuthenticated) {
        agent.add(promptAddressOfVehicle(vehicle));
      }

      else if (address) {

        if (userHasProvidedEmail) {
          agent.add(promptOtpForAuth(txnContextParams.email));
        } else {
          agent.add(promptEmailForAuth);
        }

      }

      else {

        agent.add(promptAddressOfVehicle(vehicle));

      }
    }

    else if (vehicle) {

      agent.add(acknowledgeVehicle(vehicle));
      agent.add(howCanIHelp);
      showButtons(agent, EN_TRANSACTION_OPTIONS);

    } else {

      agent.add(promptVehicle);
      showButtons(agent, EN_VEHICLE_OPTIONS);

    }

    updateContextParameters(request, agent, TRANSACTION_MODE, { vehicle, address });

  };

  return handleIntent;
};

module.exports = provideVehicle;
