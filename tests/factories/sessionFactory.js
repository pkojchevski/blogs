const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const Buffer = require('safe-buffer').Buffer;
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObject = {
    passport: { user: user._id.toString() },
  };

  // create string base64 of session object with buffer library
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

  // keygrip creates session.sig compares session validity
  const sig = keygrip.sign('session=' + session);

  return {
    sig,
    session,
  };
};
