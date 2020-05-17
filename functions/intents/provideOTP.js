const {
  updateContextParameters,
  authenticateUser,
  getContextParameters,
  showButtons
} = require('../agent-helper');
const {
  TRANSACTION_MODE
} = require('../contexts');
const {
  EN_AUTH_RETRY_OPTIONS,
  EN_YES_OR_NO,
  EN_TRANSACTION_OPTIONS
} = require('../en_options');
const {
  promptOtp,
  howCanIHelp,
  promptAuthRetry,
  parkingChargeEnquiryConfirmation,
  homeAddressUpdateConfirmation,
  acknowledgeAuthSuccess
} = require('../en_replies');

const provideOTP = request => {
  const {body} = request;
  const {queryResult} = body;
  const {parameters} = queryResult;

  // Get parameters from slot filling
  const {slot_otp} = parameters;

  // Get parameters from context
  const txnContextParams = getContextParameters(request, TRANSACTION_MODE);
  const currentRequest = txnContextParams.currentRequest || null;
  const requestIsChangeHomeAddress = currentRequest === `update_home_address`;
  const requestIsParkingChargeEnquiry = currentRequest === `enquire_parking_charges`;

  const handleIntent = agent => {
    if (slot_otp) {

      if (!currentRequest) {
        agent.add(acknowledgeAuthSuccess);
        agent.add(howCanIHelp);
        showButtons(agent, EN_TRANSACTION_OPTIONS);

        updateContextParameters(request, agent, TRANSACTION_MODE, {auth: true});
      }

      else if (authenticateUser(txnContextParams.email, slot_otp)) {

        if (requestIsChangeHomeAddress) {
          const {address} = txnContextParams;
          agent.add(homeAddressUpdateConfirmation(address));
          showButtons(agent, EN_YES_OR_NO);
        }

        else if (requestIsParkingChargeEnquiry) {
          const {vehicle, address} = txnContextParams;
          agent.add(parkingChargeEnquiryConfirmation(vehicle, address));
        }

        updateContextParameters(request, agent, TRANSACTION_MODE, {auth: true});
      }

      else {
        agent.add(promptAuthRetry);
        showButtons(agent, EN_AUTH_RETRY_OPTIONS);
      }

    }

    else {
      agent.add(promptOtp);
    }
  };

  return handleIntent;
};

module.exports = provideOTP;
