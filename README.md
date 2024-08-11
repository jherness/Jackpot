Slot Machine Game (Assignment)
This project was created as part of a technical assignment for a full-stack position. The task was to develop a slot machine game with a unique twist, leveraging real-time communication between the frontend and backend.

Features:
Slot Machine Game: A basic implementation of a slot machine game with an added twist to make the gameplay more interesting.
WebSocket Communication: The game communicates with the server in real-time using WebSocket technology, ensuring smooth and instant updates.
Node.js Server: The backend is powered by a Node.js server, handling game logic and client connections. Initially, I attempted to use a Python server, but due to some integration challenges, I pivoted to Node.js.
React Frontend: The user interface is built using React, providing a dynamic and responsive experience for players.
SQLite Database: The game data, including player scores, is stored in an SQLite database for persistence.
To-Do/Improvements:
Find Better React GUI: Improve the user interface by finding or designing a more polished and user-friendly React-based GUI.
Fix Minor Bug: Address an issue where the most important data (e.g., score) is not updated in the database when the WebSocket connection closes.
Clean Up Code: Remove unnecessary code, particularly in the frontend, to improve readability and maintainability.
Set 'Blocks' as React Functional Component: Refactor the code to implement the 'blocks' as a functional component in React.
Challenges:
While working on this project, I encountered some difficulties, particularly with the initial Python server setup and its integration with the frontend. However, these challenges allowed me to learn and adapt, ultimately leading to a functional Node.js WebSocket server.
