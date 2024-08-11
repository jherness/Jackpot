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
            randomNum1, randomNum2, randomNum3 = randNumbers()
            console.log(randomNums);
            calcPrize(randomNum1)
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