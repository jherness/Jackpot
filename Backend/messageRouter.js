const dbDriver = require('./dbDriver')


function route(message) {
  if (message.startsWith('updateTokens:')) {
    const userName = message.split(':')[1];
    const amount = message.split(':')[2];
    dbDriver.updateTokens(userName, amount);
  } else if (message.startsWith('getUserByName:')) {
    const userName = message.split(':')[1];
    dbDriver.getUserByName(userName);
  } else if (message.startsWith('login:')) {
    const userName = message.split(':')[1];
    const pass = message.split(':')[2];
    dbDriver.login(userName, pass);
  } else if (message.startsWith('addTokens:')) {
    const userName = message.split(':')[1];
    const amountToAdd = message.split(':')[2];
    dbDriver.addTokens(userName, amountToAdd, (err, message) => {
      if (err) {
        console.error('Error:', err.message);
      } else {
        console.log(message);
      }
    });
    console.log(userName, amountToAdd);
  } 
}


module.exports = {
  route
};
