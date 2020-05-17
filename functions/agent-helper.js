const {Suggestion} = require('dialogflow-fulfillment');
const {getUser} = require('./users');

const getContextParameters = (request, contextName) => {
  const {body} = request;
  const {queryResult} = body;
  const {outputContexts} = queryResult;

  const filteredOutputContexts = outputContexts.filter(outputContext =>
    outputContext.name.includes(contextName.toLowerCase())
  );

  const firstMatchingContextHasParameters =
    filteredOutputContexts
    && filteredOutputContexts[0]
    && filteredOutputContexts[0].parameters;

  if (firstMatchingContextHasParameters)
    return filteredOutputContexts[0].parameters;

  return {};
};

const updateContextParameters = (request, agent, contextName, newParams) => {
  const currentParams = getContextParameters(request, contextName);
  const DEFAULT_LIFESPAN = 5;
  const [name, lifespan] = [contextName, DEFAULT_LIFESPAN];

  if (Object.keys(currentParams).length === 0) { // if currentParams is {}
    agent.context.set({name, lifespan, parameters: newParams});
  } else {
    agent.context.set({name, lifespan, parameters: {...currentParams, ...newParams}});
  }
}

const authenticateUser = (email, OTP) => {

  let formattedEmail = email.replace(' at ', '@').trim();
  let formattedOTP = OTP.replace(/\s/g, '').trim();

  if (getUser(formattedEmail)) {
    return formattedOTP === '123456'; // Assume that the code is this
  }

  return false;
}

const showButtons = (agent, buttons) => {
  buttons.forEach(option => agent.add(new Suggestion(option)));
}

const pickAny = (items) => {
  return items[Math.floor(Math.random() * items.length)];
}

module.exports = {
  getContextParameters,
  updateContextParameters,
  authenticateUser,
  showButtons,
  pickAny
};
