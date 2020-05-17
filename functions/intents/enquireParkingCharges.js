const {
  getContextParameters,
  updateContextParameters,
  showButtons
} = require('../agent-helper');
const {
  TRANSACTION_MODE
} = require('../contexts');
const {
  promptOtpForAuth,
  promptEmailForAuth,
  parkingChargeEnquiryConfirmation,
  promptVehicleAtAddress,
  promptVehicle,
  promptAddressOfVehicle
} = require('../en_replies');
const {
  EN_VEHICLE_OPTIONS,
  EN_YES_OR_NO
} = require('../en_options');

const enquireParkingCharges = request => {
  const {body} = request;
  const {queryResult} = body;
  const {parameters} = queryResult;

  // Get parameters from slot filling
  const {slot_vehicle, slot_address} = parameters;

  // Get parameters from context
  const txnContextParams = getContextParameters(request, TRANSACTION_MODE);
  const userIsAuthenticated = txnContextParams.auth || false;
  const userHasProvidedEmail = txnContextParams.email || false;

  // Take values from slot filling, or otherwise from existing transaction context, to set in context later
  const vehicle = slot_vehicle || txnContextParams.vehicle;
  const address = slot_address || txnContextParams.address;
  const currentRequest = `enquire_parking_charges`;

  const handleIntent = agent => {

    if (vehicle && address && userIsAuthenticated) {
      agent.add(parkingChargeEnquiryConfirmation(vehicle, address));
      showButtons(agent, EN_YES_OR_NO);
    }

    else if (vehicle && userIsAuthenticated) {
      agent.add(promptAddressOfVehicle(vehicle));
    }

    else if (address && userIsAuthenticated) {
      agent.add(promptVehicleAtAddress(address));
      showButtons(agent, EN_VEHICLE_OPTIONS);
    }

    else if (vehicle && address) {
      if (userHasProvidedEmail) {
        agent.add(promptOtpForAuth(txnContextParams.email));
      } else {
        agent.add(promptEmailForAuth);
      }
    }

    else if (vehicle) {
      agent.add(promptAddressOfVehicle(vehicle));
    }

    else if (address) {
      agent.add(promptVehicleAtAddress(address));
      showButtons(agent, EN_VEHICLE_OPTIONS);
    }

    else {
      agent.add(promptVehicle);
      showButtons(agent, EN_VEHICLE_OPTIONS);
    }

    updateContextParameters(request, agent, TRANSACTION_MODE, { currentRequest, vehicle, address });
  };

  return handleIntent;
};

module.exports = enquireParkingCharges;
