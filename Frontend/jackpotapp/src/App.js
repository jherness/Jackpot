import React, { useState, useEffect, useRef } from 'react';
import {SERVER_URL, PORT, symbols} from './Conf';
import './App.css';


const App = () => {
  const [isSpinning, setIsSpinning] = useState(false); // Indicates if the slots are spinning
  const [sessionId, setSessionId] = useState(null); // Stores the current session ID
  const [credits, setCredits] = useState(10); // Stores the user's credits
  const [slots, setSlots] = useState(['X', 'X', 'X']); // Stores the current slot values
  const [ws, setWs] = useState(null); // Stores WebSocket connection
  const [hasWon, setHasWon] = useState(false); // New state to track if the user has won
  
  
  //Slots options
  const options = symbols


  // Refs to hold final slot values and credits
  const finalSlot2Ref = useRef('X');
  const finalSlot3Ref = useRef('X');
  const creditsRef = useRef(0);


  useEffect(() => {
    const socket = new WebSocket(SERVER_URL+':'+PORT);
    socket.onmessage = handleServerMessage;
    setWs(socket);

    // Start the game session automatically
    socket.onopen = () => {
      socket.send('start');
    };
  }, []);


  const handleServerMessage = (event) => {
    const message = event.data;


    // Handle incoming messages from the server
    if (message.startsWith('session:')) {
      const [, id, initialCredits] = message.split(':');
      setSessionId(id);
      setCredits(parseInt(initialCredits));
    } else if (message.startsWith('spinRes:')) {
      const [, slot1, slot2, slot3, updatedCredits] = message.split(':');
      setSlots([slot1, slot2, slot3]);

      finalSlot2Ref.current = options[parseInt(slot2, 10)];
      finalSlot3Ref.current = options[parseInt(slot3, 10)];
      creditsRef.current = updatedCredits;

      startSpinningSlot1(parseInt(slot1, 10));

      // Check if the user has won and update the state
      const hasUserWon = slot1 === slot2 && slot2 === slot3;
      setHasWon(hasUserWon);
    } else if (message.startsWith('cashOut:')) {
      alert(`You cashed out with ${message.split(':')[1]} credits!`);
    }
  };


  const updateSlot = (index, newValue) => {
    setSlots(prevSlots => {
      const updatedSlots = [...prevSlots];
      updatedSlots[index] = newValue;
      return updatedSlots;
    });
  };


  const rollSlots = () => {
    if (credits <= 0 || isSpinning) return;
    setHasWon(false); // Reset the win state when rolling
    startSpinning23();
    ws.send(`roll:${sessionId}`);
  };


  const cashOut = () => {
    ws.send(`cashout:${sessionId}`);
    setHasWon(false); // Hide the button after cashing out
    setIsSpinning(true)
  };


  /*---------------- Time Out section ----------------*/

  const startSpinningSlot1 = (slot1Value) => {
    let currentIndex = 0;
    const block1Interval = setInterval(() => {
      updateSlot(0, options[currentIndex]);
      currentIndex = (currentIndex + 1) % options.length;
    }, 100);

    setTimeout(() => {
      clearInterval(block1Interval);
      updateSlot(0, options[slot1Value]);
    }, 1000);
  };


  const startSpinning23 = () => {
    setIsSpinning(true);

    let currentIndex2 = 0;
    const block2Interval = setInterval(() => {
      updateSlot(1, options[currentIndex2]);
      currentIndex2 = (currentIndex2 + 1) % options.length;
    }, 100);

    setTimeout(() => {
      clearInterval(block2Interval);
      updateSlot(1, finalSlot2Ref.current);
    }, 2000);

    let currentIndex3 = 0;
    const block3Interval = setInterval(() => {
      updateSlot(2, options[currentIndex3]);
      currentIndex3 = (currentIndex3 + 1) % options.length;
    }, 100);

    setTimeout(() => {
      clearInterval(block3Interval);
      setIsSpinning(false);
      updateSlot(2, finalSlot3Ref.current);
      //Update the credits after spin animation ends
      setCredits(parseInt(creditsRef.current));
    }, 3000);
  };



  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <table style={{ margin: '0 auto', border: '1px solid black' }}>
        <tbody>
          <tr>
            <td className="block">{slots[0]}</td>
            <td className="block">{slots[1]}</td>
            <td className="block">{slots[2]}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={rollSlots} disabled={isSpinning || credits <= 0}
        style={{ marginTop: '20px', padding: '10px 20px' }}>
        {credits === 0 ? "Game Over :(" : "Play!"}
      </button>
      {/*Cash Out Btn is visible only after a win. If client Chooses to play again
      , the opportunity is gone and btn disappears*/}
      {(hasWon && credits > 0 && !isSpinning) && (
        <button onClick={cashOut} style={{ marginLeft: '20px', marginTop: '20px', padding: '10px 20px' }}>
          Cash Out
        </button>
      )}
      <h1>Credits: {credits}</h1>
    </div>
  );
};

export default App;









