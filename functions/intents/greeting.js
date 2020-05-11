const {Suggestion} = require('dialogflow-fulfillment');

const EN_WELCOME = `Hi. I'm AuthBot. In this demo, you'll provide a valid transactional request and I'll authenticate you before fulfilling it.`;
const EN_OPTIONS = [`Change home address`, `Check parking charges`, `Pay season parking`];

const welcome = request => {
  const handleIntent = agent => {
    agent.add(EN_WELCOME);
    EN_OPTIONS.forEach(option => agent.add(new Suggestion(option)));
  };

  return handleIntent;
};

module.exports = welcome;
