import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tokens, setTokens] = useState(10);
  const [userName, setUserName] = useState('Admin1');
  const [socket, setSocket] = useState(null);
  const [block1, setBlock1] = useState('A');
  const [block2, setBlock2] = useState('A');
  const [block3, setBlock3] = useState('A');
  const [isSpinning, setIsSpinning] = useState(false);
  const letters = ['C', 'L', 'O', 'W'];

  // Use refs to hold final slot values 
  const finalSlotYRef = React.useRef('A');
  const finalSlotZRef = React.useRef('A');


  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (message) => {
      if (message.data.startsWith('spinRes:')) {
        const [_, slotX, newSlotY, newSlotZ] = message.data.split(':');
        console.log(slotX, newSlotY, newSlotZ);

        // Store the final values in refs
        finalSlotYRef.current = letters[parseInt(newSlotY, 10)];
        finalSlotZRef.current = letters[parseInt(newSlotZ, 10)];

        // Start spinning slotX after updating slotY and slotZ
        startSpinningSlotX(parseInt(slotX, 10));
      }
      else if (message.data.startsWith(`Tokens`)){
        setTokens(message.data.split(':')[2])
      }
    };
    //Update db when user leaves the session
    ws.onclose = () => {
      if(tokens>=0)
        sendMessage(`addTokens:${userName}:${tokens}`);
    };
    
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (socket && message) {
      socket.send(message);
    }
  };

  const startSpinningSlotX = (slotX) => {
    let currentIndex = 0;
    const block1Interval = setInterval(() => {
      setBlock1(letters[currentIndex]);
      currentIndex = (currentIndex + 1) % letters.length;
    }, 100);

    setTimeout(() => {
      setBlock1(letters[slotX]);
      clearInterval(block1Interval);
    }, 1000);
  };

  const startSpinningYZ = () => {
    setIsSpinning(true);

    let currentIndex2 = 0;
    const block2Interval = setInterval(() => {
      setBlock2(letters[currentIndex2]);
      currentIndex2 = (currentIndex2 + 1) % letters.length;
    }, 100);

    setTimeout(() => {
      clearInterval(block2Interval);
      setBlock2(finalSlotYRef.current); // Use the final value for block2
    }, 2000);

    let currentIndex3 = 0;
    const block3Interval = setInterval(() => {
      setBlock3(letters[currentIndex3]);
      currentIndex3 = (currentIndex3 + 1) % letters.length;
    }, 100);

    setTimeout(() => {
      clearInterval(block3Interval);
      setIsSpinning(false);
      setBlock3(finalSlotZRef.current); // Use the final value for block3
    }, 3000);
  };

  const handleRoll = () => {
    setTokens(prev => prev -1)
    startSpinningYZ();
    sendMessage(`roll:${userName}:${tokens}`);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <table style={{ margin: '0 auto', border: '1px solid black' }}>
        <tbody>
          <tr>
            <td className="block">{block1}</td>
            <td className="block">{block2}</td>
            <td className="block">{block3}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleRoll} disabled={isSpinning} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Play!
      </button>
      <h1>Tokens: {tokens}</h1>
    </div>
  );
}

export default App;








