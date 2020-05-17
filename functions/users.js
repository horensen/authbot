const _users = [
  {"id": "4226201987", "email": "someone@gmail.com", "mobile": "97875077"},
  {"id": "5819949129", "email": "user@gmail.com", "mobile": "85071839"},
  {"id": "7562282624", "email": "tester@gmail.com", "mobile": "83276688"}
];

const getLastTwoDigitsOfMobile = email => {
  const user = getUser(email);

  if (user) {
    const {mobile} = user;
    const lastTwoDigits = mobile.substring(mobile.length - 2, mobile.length);
    return lastTwoDigits;
  }

  return null;
}

const getUser = (email) => {
  return _users.find(user => user.email === email);
}

module.exports = {
  getLastTwoDigitsOfMobile,
  getUser
}
