const express = require("express");
const WebSocket = require('ws');
const { PORT } = require('./Conf')
const sessionDriver = require('./sessionDriver')

const app = express();
const wss = new WebSocket.Server({ port: PORT });
console.log(`WebSocket server is running on ws://localhost:${PORT}`);
const options = ['C', 'L', 'O', 'W'];

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A new client connected');
  const sessionId = sessionDriver.startSession();
  ws.send(`session:${sessionId}:10`); // Send session ID and starting credits

  ws.on('message', (data) => {
    const message = data.toString();

    if (message.startsWith('roll')) {
      const [_, sessionId] = message.split(':');
      handleRoll(ws, sessionId);
    } else if (message.startsWith('cashout')) {
      const [_, sessionId] = message.split(':');
      handleCashOut(ws, sessionId);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Handle a roll request
const handleRoll = (ws, sessionId) => {
  if (!sessionDriver.sessionExists(sessionId)) return ws.send('error:Invalid session');

  let randomNums = genRandNumbers();
  if (randomNums[0] === randomNums[1] && randomNums[1] === randomNums[2]) {
    if (shouldReroll(sessionDriver.getSessionCredits(sessionId))) {
      randomNums = genRandNumbers();
      console.log("ReRoll!");
    }
    sessionDriver.addCreditsToSession(sessionId, calcPrize(randomNums))
  }
  else
    sessionDriver.deductCredit((sessionId))
  ws.send(`spinRes:${randomNums.join(':')}:${sessionDriver.getSessionCredits(sessionId)}`);
  console.log(`spinRes:${randomNums.join(':')}:${sessionDriver.getSessionCredits(sessionId)}`);
};


// Handle cash out request
const handleCashOut = (ws, sessionId) => {
  if (!sessionDriver.sessionExists(sessionId)) return ws.send('error:Invalid session');

  // Transfer credits to the user's account
  sessionDriver.cashOut(sessionId, credits)
  ws.send(`cashOut:${credits}`);
  console.log(`Cash out successful. Credits moved to user account: ${credits}`);
};

// Determine if a reroll should happen based on credits
const shouldReroll = (credits) => {
  if (credits >= 60) {
    return Math.random() < 0.6;
  } else if (credits >= 40) {
    return Math.random() < 0.3;
  }
  return false;
};

// Calculate the prize based on the rolled number
const calcPrize = (randomNums) => {
  if (randomNums[0] != randomNums[1] || randomNums[1] != randomNums[2] || randomNums[0] != randomNums[2])
    return -1;
  switch (randomNums[0]) {
    case 0:
      return 10;
    case 1:
      return 20;
    case 2:
      return 30;
    case 3:
      return 40;
    default:
      return 0;
  }
};

// Generate three random numbers for the slot machine
const genRandNumbers = () => {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * options.length));
};

module.exports = app;



