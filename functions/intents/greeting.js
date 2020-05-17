const {EN_TRANSACTION_OPTIONS} = require('../en_options');
const {introduction} = require('../en_replies');
const {showButtons} = require('../agent-helper');

const welcome = request => {
  const handleIntent = agent => {
    agent.add(introduction);
    showButtons(agent, EN_TRANSACTION_OPTIONS);
  };

  return handleIntent;
};

module.exports = welcome;
