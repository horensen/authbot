function getContextParameters (request, contextName) {
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

function updateContextParameters (request, agent, contextName, newParams) {
  const currentParams = getContextParameters(request, contextName);
  const DEFAULT_LIFESPAN = 5;
  const [name, lifespan] = [contextName, DEFAULT_LIFESPAN];

  if (Object.keys(currentParams).length === 0) { // if currentParams is {}
    agent.context.set({name, lifespan, parameters: newParams});
  } else {
    agent.context.set({name, lifespan, parameters: {...currentParams, ...newParams}});
  }
}

function authenticateUser (email, OTP) {
  return email === 'tester@gmail.com' && OTP === '123456'; // Assume that authentication is a success
}

module.exports = {
  getContextParameters,
  updateContextParameters,
  authenticateUser
};
