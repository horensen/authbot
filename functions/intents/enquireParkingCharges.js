const { getContextParameters, updateContextParameters } = require('../agent-helper');

const enquireParkingCharges = request => {
  const {body} = request;
  const {queryResult} = body;
  const {parameters} = queryResult;
  const {vehicle, address} = parameters;

  // Get parameters from slot filling
  const vehicleIsSaid = vehicle !== '';
  const addressIsSaid = address !== '';

  // Get parameters from context
  const txnContextParams = getContextParameters(request, 'transaction_mode');
  const userIsAuthenticated = txnContextParams.auth || false;
  const userHasSaidAddressPreviously = txnContextParams.address || false;

  const handleIntent = agent => {
    agent.add(`Details: ${vehicle}, ${address}, ${txnContextParams.address}`);
  };

  return handleIntent;
};

module.exports = enquireParkingCharges;
