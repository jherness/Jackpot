const { v4 } = require('uuid');
const sessions = {}; // Store sessions by session ID
const userAccounts = {}; // Store user accounts by session ID


const startSession = () => {
    const sessionId = v4();
    sessions[sessionId] = { credits: 10 };
    userAccounts[sessionId] = { totalCredits: 0 }; // Initialize user account
    return sessionId;
};

const sessionExists = (sessionId) => { return sessions[sessionId] }

const getSessionCredits = (sessionId) => {
    if (sessions[sessionId]) {
        let obj = Object.assign({}, sessions[sessionId])
        console.log(obj.credits + " Here");
        
        return obj.credits;
    }
}


const getSessionById = (sessionId) => {
    if (sessions[sessionId]) {
        return sessions[sessionId]
    }
}


const addCreditsToSession = (sessionId, amount) => {
    if (sessions[sessionId]) {
        sessions[sessionId].credits += amount
        return true;
    }
    return false;
}

const deductCredit = (sessionId) => {
    if (sessions[sessionId]) {
        sessions[sessionId].credits -= 1
        return true;
    }
    return false;
}

const cashOut = (sessionId, credits) => {
    userAccounts[sessionId].totalCredits += credits;
    delete sessions[sessionId];
}


module.exports = {
    startSession,
    getSessionCredits,
    sessionExists,
    addCreditsToSession,
    getSessionById,
    deductCredit,
    cashOut
};



/*



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

  let randomNums = [0, 0, 0]//genRandNumbers(); 
  const tokens = session.credits;
  let reRollFlag = false;

  if (randomNums[0] === randomNums[1] && randomNums[1] === randomNums[2]) {
    if (shouldReroll(tokens)) {
      randomNums = genRandNumbers();
      reRollFlag = true;
      console.log("ReRoll!");
    }
    session.credits += calcPrize(randomNums[0])
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
const shouldReroll = (credits) => {
  if (credits >= 60) {
    return Math.random() < 0.6;
  } else if (credits >= 40) {
    return Math.random() < 0.3;
  }
  return false;
};

// Calculate the prize based on the rolled number
const calcPrize = (randomNum) => {
  switch (randomNum) {
    case 0:
      return 10;
    case 1:
      return 20;
    case 2:
      return 30;
    case 3:
      return 40;
  }
};

// Generate three random numbers for the slot machine
const genRandNumbers = () => {  
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * options.length));
};

module.exports = app;





*/

