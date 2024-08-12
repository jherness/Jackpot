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
  session.credits--;

  if (randomNums[0] === randomNums[1] && randomNums[1] === randomNums[2]) {
    calcPrize(session, randomNums[0]);

    while (shouldReroll(tokens)) {
      randomNums = genRandNumbers();
      calcPrize(session, randomNums[0]);
    }
  }

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

// Determine if a reroll should happen based on tokens
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






/*

const express = require("express");
const app = express();
const WebSocket = require('ws');
const messageRouter = require('./messageRouter');
const dbDriver = require('./dbDriver');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server is running on ws://localhost:8080');

const options = ['C', 'L', 'O', 'W'];
let startTokens = 10;

// Listen for connection events
wss.on('connection', (ws) => {
  console.log('A new client connected to WebSocket Server');

  // Listen for messages from the client
  ws.on('message', (data, isBinary) => {
    const message = isBinary ? data : data.toString();

    if (message.startsWith('roll')) {
      handleRoll(ws, message);
    } else {
      startTokens--; // Assuming a default token deduction on non-roll messages
      messageRouter.route(message);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Handle the roll logic
const handleRoll = (ws, message) => {
  let randomNums = genRandNumbers();
  console.log(randomNums);
  ws.send(`spinRes:${randomNums.join(':')}`);

  const tokens = parseInt(message.split(':')[2]);

  // Check if the user won the jackpot
  if (randomNums[0] === randomNums[1] && randomNums[1] === randomNums[2]) {
    calcPrize(randomNums[0]);
    ws.send(`addTokens:Admin1:${startTokens}`);

    // Handle reroll logic based on tokens
    while (shouldReroll(tokens)) {
      randomNums = genRandNumbers();
      console.log(randomNums);
      calcPrize(randomNums[0]);
      ws.send(`addTokens:Admin1:${startTokens}`);
      ws.send(`spinRes:${randomNums.join(':')}`);
    }
  }
};

// Determine if a reroll should happen based on tokens
const shouldReroll = (tokens) => {
  if (tokens >= 60) {
    return Math.random() < 0.6;  // 60% chance to reroll
  } else if (tokens >= 40) {
    return Math.random() < 0.3;  // 30% chance to reroll
  }
  // No reroll for less than 40 credits (truly random rolls)
  return false;
};


// Calculate the prize based on the rolled number
const calcPrize = (randomNum) => {
  switch (randomNum) {
    case 0:
      startTokens += 10;
      break;
    case 1:
      startTokens += 20;
      break;
    case 2:
      startTokens += 30;
      break;
    case 3:
      startTokens += 40;
      break;
  }
};

// Generate three random numbers for the slot machine
const genRandNumbers = () => {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * options.length));
};

module.exports = app;

*/






/*
const express = require("express");
const app = express();
const WebSocket = require('ws');
const messageRouter = require('./messageRouter')
const dbDriver = require('./dbDriver');



// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server is running on ws://localhost:8080');
const options = ['C', 'L', 'O', 'W'];
const wonLastRoll = false;
var startTokens = 10;


// Listen for connection events
wss.on('connection', (ws) => {
  console.log('A new client connected to WebSocket Server');
  // Send a message to the client when they connect

  // Listen for messages from the client, Make sure is not showing in server as binary
  ws.on('message', function message(data, isBinary) {
    const message = isBinary ? data : data.toString();


    if (message.startsWith('roll')) {
      let randomNums = genRandNumbers()
      console.log(randomNums);
      ws.send(`spinRes:${randomNums[0]}:${randomNums[1]}:${randomNums[2]}`);

      let tokens = message.split(':')[2]

      //if user won and while he keeps winning;
      if (randomNums[0] == randomNums[1] && randomNums[1] == randomNums[2]) {
        while (randomNums[0] == randomNums[1] && randomNums[1] == randomNums[2]) {
          //Reroll chance is 30% if user has 40-60 credits
          if (tokens >= 40 && tokens < 60) {
            let reRollChance = Math.floor(Math.random() * 10)
            if (reRollChance < 3) {
              randomNums = genRandNumbers()
              console.log(randomNums);
              calcPrize(randomNum[0])
              ws.send(`addTokens:Admin1:${startTokens}`)
            }
            ws.send(`spinRes:${randomNums[0]}:${randomNums[1]}:${randomNums[2]}`);
          }
          //Reroll chance is 60% if user has 60+ credits
          else if (tokens >= 60) {
            let reRollChance = Math.floor(Math.random() * 10)
            if (reRollChance < 6) {
              randomNums = genRandNumbers()
              calcPrize(randomNum[0])
              ws.send(`addTokens:Admin1:${startTokens}`)
            }
            ws.send(`spinRes:${randomNums[0]}:${randomNums[1]}:${randomNums[2]}`);
          }
          else {
            randomNums, randomNums, randomNums = randNumbers()
            console.log(randomNums);
            calcPrize(randomNums[0])
            ws.send(`addTokens:Admin1:${startTokens}`)
            ws.send(`spinRes:${randomNums[0]}:${randomNums[1]}:${randomNums[2]}`);
          }
        }
      }

    }
    else { startTokens--; messageRouter.route(message); }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Bye');
  });

});


module.exports = app;




const calcPrize = (randomNum) => {
  switch (randomNum) {
    case 0:
      startTokens += 10
      break
    case 1:
      startTokens += 20
      break
    case 2:
      startTokens += 30
      break
    case 3:
      startTokens += 40;
      return
  }
}


const genRandNumbers = () => {
  var n = [];
  for (var i = 0; i < 3; i++) {
    n.push(Math.floor(Math.random() * options.length));
  }
  return n;
} 

*/