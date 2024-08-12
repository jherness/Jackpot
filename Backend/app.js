const express = require("express");
const WebSocket = require('ws');
const { v4 } = require('uuid');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server is running on ws://localhost:8080');

const sessions = {}; // Store sessions by session ID
const userAccounts = {}; // Store user accounts by session ID
const options = ['C', 'L', 'O', 'W'];

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A new client connected');
  const sessionId = startSession();
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

// Start a new session
const startSession = () => {
  const sessionId = v4();
  sessions[sessionId] = { credits: 10 };
  userAccounts[sessionId] = { totalCredits: 0 }; // Initialize user account
  return sessionId;
};

// Handle a roll request
const handleRoll = (ws, sessionId) => {
  const session = sessions[sessionId];
  if (!session) return ws.send('error:Invalid session');

  let randomNums = genRandNumbers(); 
  const tokens = session.credits;

  if (randomNums[0] === randomNums[1] && randomNums[1] === randomNums[2]) {
    calcPrize(session, randomNums[0]);
    if (shouldReroll(tokens)) {
      randomNums = genRandNumbers();
      calcPrize(session, randomNums[0]);
      console.log("Unlucky, ReRoll!");
    }
  }
  else {session.credits--;}

  ws.send(`spinRes:${randomNums.join(':')}:${session.credits}`);
  console.log(`spinRes:${randomNums.join(':')}:${session.credits}`);
};


// Handle cash out request
const handleCashOut = (ws, sessionId) => {
  const session = sessions[sessionId];
  if (!session) return ws.send('error:Invalid session');
  const credits = session.credits;
  // Transfer credits to the user's account
  userAccounts[sessionId].totalCredits += credits;
  // Remove session data
  delete sessions[sessionId];
  // Send cash out response
  ws.send(`cashOut:${credits}`);

  console.log(`Cash out successful. Credits moved to user account: ${credits}`);
};

// Determine if a reroll should happen based on credits
const shouldReroll = (tokens) => {
  if (tokens >= 60) {
    return Math.random() < 0.6;
  } else if (tokens >= 40) {
    return Math.random() < 0.3;
  }
  return false;
};

// Calculate the prize based on the rolled number
const calcPrize = (session, randomNum) => {
  switch (randomNum) {
    case 0:
      session.credits += 10;
      break;
    case 1:
      session.credits += 20;
      break;
    case 2:
      session.credits += 30;
      break;
    case 3:
      session.credits += 40;
      break;
  }
};

// Generate three random numbers for the slot machine
const genRandNumbers = () => {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * options.length));
};

module.exports = app;




