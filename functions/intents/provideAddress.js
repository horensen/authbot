const {
  getContextParameters,
  updateContextParameters,
  showButtons
} = require('../agent-helper');
const {
  EN_VEHICLE_OPTIONS,
  EN_YES_OR_NO,
  EN_TRANSACTION_OPTIONS
} = require('../en_options');
const {
  TRANSACTION_MODE
} = require('../contexts');
const {
  promptOtpForAuth,
  promptEmailForAuth,
  homeAddressUpdateConfirmation,
  parkingChargeEnquiryConfirmation,
  promptVehicleAtAddress,
  howCanIHelp,
  promptAddress,
  acknowledgeAddress
} = require('../en_replies');

const provideAddress = request => {
  const {body} = request;
  const {queryResult} = body;
  const {parameters} = queryResult;

  // Get parameters from slot filling
  const {slot_address} = parameters;

  // Get parameters from context
  const txnContextParams = getContextParameters(request, TRANSACTION_MODE);
  const userIsAuthenticated = txnContextParams.auth || false;
  const userHasProvidedEmail = txnContextParams.email || false;
  const currentRequest = txnContextParams.currentRequest || null;
  const requestIsChangeHomeAddress = currentRequest === `update_home_address`;
  const requestIsParkingChargeEnquiry = currentRequest === `enquire_parking_charges`;

  // Take values from slot filling, or otherwise from existing transaction context, to set in context later
  const address = slot_address || txnContextParams.address;
  const vehicle = txnContextParams.vehicle || ''; // additional related parameter

  const handleIntent = agent => {

    if (requestIsChangeHomeAddress) {

      if (userIsAuthenticated) {
        agent.add(homeAddressUpdateConfirmation(address));
      }

      else {

        if (userHasProvidedEmail) {
          agent.add(promptOtpForAuth(txnContextParams.email));
        } else {
          agent.add(promptEmailForAuth);
        }

      }

    }

    else if (requestIsParkingChargeEnquiry) {

      if (userIsAuthenticated && vehicle) {
        agent.add(parkingChargeEnquiryConfirmation(vehicle, address));
        showButtons(agent, EN_YES_OR_NO);
      }

      else if (userIsAuthenticated) {
        agent.add(promptVehicleAtAddress(address));
        showButtons(agent, EN_VEHICLE_OPTIONS);
      }

      else if (vehicle) {

        if (userHasProvidedEmail) {
          agent.add(promptOtpForAuth(txnContextParams.email));
        } else {
          agent.add(promptEmailForAuth);
        }

      }

      else {

        agent.add(promptVehicleAtAddress(address));
        showButtons(agent, EN_VEHICLE_OPTIONS);
      }

    }

    else if (address) {

      agent.add(acknowledgeAddress(address));
      agent.add(howCanIHelp);
      showButtons(agent, EN_TRANSACTION_OPTIONS);

    } else {

      agent.add(promptAddress);

    }

    updateContextParameters(request, agent, TRANSACTION_MODE, { address, vehicle });
  };

  return handleIntent;
};

module.exports = provideAddress;
