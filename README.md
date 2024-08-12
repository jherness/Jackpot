Slot Machine Game (Assignment)
This project was created as part of a technical assignment. The task was to develop a slot machine game with a unique twist, leveraging real-time communication between the frontend and backend.

Features:
Slot Machine Game: A basic implementation of a slot machine game with an added twist to make the gameplay more interesting.
WebSocket Communication: The game communicates with the server in real-time using WebSocket technology, ensuring smooth and instant updates.

Node.js Server:
The backend uses Express and WebSocket to handle communication between the server and clients.
It manages sessions and user accounts using in-memory storage.
When a client connects, a new session is started with 10 credits.
On receiving a roll request, the backend generates random slot values, calculates prizes, and determines if a reroll should occur based on the credits.
On receiving a cash-out request, it transfers the remaining credits to the user's account, deletes the session, and sends a confirmation to the client.
The backend also includes utility functions to generate random numbers for slot results, determine reroll chances, and calculate prizes.Frontend:

React Client
The frontend is a React application that connects to a WebSocket server.
It maintains states for spinning, session ID, credits, slots, and whether the user has won.
On initial load, it establishes a WebSocket connection and starts a session.
When receiving messages from the server, it updates the UI based on the session, slot results, and cash-out events.
It provides functions to start spinning slots and cash out. The cash-out button is only shown after a win and when the slots are not spinning.
Slots spin with animations, and credits are updated after the animation completes.


Challenges:
While working on this project, I encountered some difficulties, particularly with the initial Python server setup and its integration with the frontend.
 However, these challenges allowed me to learn and adapt, ultimately leading to a functional Node.js WebSocket server.


