const {getLastTwoDigitsOfMobile} = require('./users');
const {pickAny} = require('./agent-helper');

const introduction = `Hi. I'm AuthBot. In this demo, you'll choose one transactional request. Then I'll authenticate you before fulfilling it. I'll also show you that I'm capable of remembering information, so you don't have to repeat yourself.`;
const howCanIHelp = pickAny([`What can I do for you?`, `How can I assist you?`, `What transactions can I do for you?`]);
const okay = pickAny([`OK.`, `Alright.`]);

const promptOtpForAuth = email => `A 6-digit OTP has been sent to your mobile number ending with ${getLastTwoDigitsOfMobile(email)}. What's the number?`;
const promptEmailForAuth = `Before I continue, I'll just need to authenticate you. What's your email address?`;
const promptEmail = pickAny([`What's your email address?`, `Please tell me your email address.`]);
const promptOtp = pickAny([`What's the OTP?`, `Please tell me the OTP.`]);
const promptAddress = pickAny([`What's the address?`, `Please tell me the address.`]);
const promptVehicle = pickAny([`What kind of vehicle do you own?`, `Please tell me the type of vehicle.`]);
const promptNewHomeAddress = pickAny([`What's your new home address?`, `Please tell me the new home address.`]);
const promptVehicleAtAddress = address => `What kind of vehicle do you own at "${address.toUpperCase()}?"`;
const promptAddressOfVehicle = vehicle => `Can you tell me the address where your ${vehicle} is parked?`;
const promptAuthRetry = `Sorry, I cannot proceed with your request because the email and OTP combination is wrong. Please retry.`;

const acknowledgeAddress = address => `Noted the address "${address.toUpperCase()}".`;
const acknowledgeVehicle = vehicle => `Noted it's a ${vehicle}.`;
const acknowledgeEmail = email => `Noted your email address "${email}".`;
const acknowledgeAuthSuccess = `You are now authenticated.`;
const acknowledgeSuccessfulHomeAddressUpdate = address => `Done. Your new home address on file is now "${address.toUpperCase()}". Is there anything else I can do for you?`;
const answerParkingChargeEnquiry = (vehicle, address, parkingChargeAmount) => `The parking charge for your ${vehicle} at ${address.toUpperCase()} is ${parkingChargeAmount}. Is there anything else I can do for you?`;

const homeAddressUpdateConfirmation = address => `You'd like to update your home address to "${address.toUpperCase()}". Is that right?`;
const parkingChargeEnquiryConfirmation = (vehicle, address) => `You want to find out the parking charges for your ${vehicle} at "${address.toUpperCase()}". Is that correct?`

module.exports = {
  introduction,
  howCanIHelp,
  okay,
  promptOtpForAuth,
  promptEmailForAuth,
  promptEmail,
  promptOtp,
  promptAddress,
  promptVehicle,
  promptNewHomeAddress,
  promptVehicleAtAddress,
  promptAddressOfVehicle,
  promptAuthRetry,
  acknowledgeAddress,
  acknowledgeVehicle,
  acknowledgeEmail,
  acknowledgeAuthSuccess,
  acknowledgeSuccessfulHomeAddressUpdate,
  answerParkingChargeEnquiry,
  homeAddressUpdateConfirmation,
  parkingChargeEnquiryConfirmation
}
