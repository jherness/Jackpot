import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [credits, setCredits] = useState(10);
  const [slots, setSlots] = useState(['X', 'X', 'X']);
  const [ws, setWs] = useState(null);
  const [hasWon, setHasWon] = useState(false); // New state to track if the user has won
  const options = ['C', 'L', 'O', 'W'];

  // Refs to hold final slot values
  const finalSlot2Ref = useRef('A');
  const finalSlot3Ref = useRef('A');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onmessage = handleServerMessage;
    setWs(socket);

    // Start the game session automatically
    socket.onopen = () => {
      socket.send('start');
    };
  }, []);

  const handleServerMessage = (event) => {
    const message = event.data;

    if (message.startsWith('session:')) {
      const [, id, initialCredits] = message.split(':');
      setSessionId(id);
      setCredits(parseInt(initialCredits));
    } else if (message.startsWith('spinRes:')) {
      const [, slot1, slot2, slot3, updatedCredits] = message.split(':');
      setSlots([slot1, slot2, slot3]);
      setCredits(parseInt(updatedCredits));

      finalSlot2Ref.current = options[parseInt(slot2, 10)];
      finalSlot3Ref.current = options[parseInt(slot3, 10)];
      
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
        Play!
      </button>
      {hasWon && credits > 0 && (
        <button onClick={cashOut} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Cash Out
        </button>
      )}
      <h1>Credits: {credits}</h1>
    </div>
  );
};

export default App;





/*
import React, { useState, useEffect, useRef } from 'react';
import './SlotTable.css';

const App = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [credits, setCredits] = useState(10);
  const [slots, setSlots] = useState(['X', 'X', 'X']);
  const [ws, setWs] = useState(null);
  const options = ['C', 'L', 'O', 'W'];

  // Refs to hold final slot values
  const finalSlotYRef = useRef('A');
  const finalSlotZRef = useRef('A');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onmessage = handleServerMessage;
    setWs(socket);

    // Start the game session automatically
    socket.onopen = () => {
      socket.send('start');
    };
  }, []);

  const handleServerMessage = (event) => {
    const message = event.data;

    if (message.startsWith('session:')) {
      const [, id, initialCredits] = message.split(':');
      setSessionId(id);
      setCredits(parseInt(initialCredits));
    } else if (message.startsWith('spinRes:')) {
      const [, slot1, slot2, slot3, updatedCredits] = message.split(':');
      setSlots([slot1, slot2, slot3]);
      setCredits(parseInt(updatedCredits));

      finalSlotYRef.current = options[parseInt(slot2, 10)];
      finalSlotZRef.current = options[parseInt(slot3, 10)];
      
      startSpinningSlot1(parseInt(slot1, 10));
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
    startSpinning23();
    ws.send(`roll:${sessionId}`);
  };

  const cashOut = () => {
    ws.send(`cashout:${sessionId}`);
  };

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
      updateSlot(1, finalSlotYRef.current);
    }, 2000);

    let currentIndex3 = 0;
    const block3Interval = setInterval(() => {
      updateSlot(2, options[currentIndex3]);
      currentIndex3 = (currentIndex3 + 1) % options.length;
    }, 100);

    setTimeout(() => {
      clearInterval(block3Interval);
      setIsSpinning(false);
      updateSlot(2, finalSlotZRef.current);
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
        Play!
      </button>
      <button onClick={cashOut}>Cash Out</button>
      <h1>Credits: {credits}</h1>
    </div>
  );
};

export default App;
*/



/*
import React, { useEffect, useState } from 'react';
import './SlotTable.css';

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
      else if (message.data.startsWith('Tokens')) {
        const [, , newTokens] = message.data.split(':');
        setTokens(parseInt(newTokens, 10));
      }
    };

    // Update DB when user leaves the session
    ws.onclose = () => {
      if (tokens >= 0) sendMessage(`addTokens:${userName}:${tokens}`);
    };

    return () => {
      ws.close();
    };
  }, [tokens]);

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
    setTokens((prev) => prev - 1);
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

*/

/*

import React, { useEffect, useState, useRef } from 'react';
import './SlotTable.css';

function App() {
  const [tokens, setTokens] = useState(10);
  const [userName, setUserName] = useState('Admin1');
  const [socket, setSocket] = useState(null);
  const [block1, setBlock1] = useState('A');
  const [block2, setBlock2] = useState('A');
  const [block3, setBlock3] = useState('A');
  const [isSpinning, setIsSpinning] = useState(false);
  const letters = ['C', 'L', 'O', 'W'];

  // Refs to hold final slot values
  const finalSlotYRef = useRef('A');
  const finalSlotZRef = useRef('A');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith('spinRes:')) {
        const [_, slotX, newSlotY, newSlotZ, updatedTokens] = message.split(':');
        console.log(slotX, newSlotY, newSlotZ);

        // Store the final values in refs
        finalSlotYRef.current = letters[parseInt(newSlotY, 10)];
        finalSlotZRef.current = letters[parseInt(newSlotZ, 10)];

        // Update tokens
        setTokens(parseInt(updatedTokens, 10));

        // Start spinning slotX after updating slotY and slotZ
        startSpinningSlotX(parseInt(slotX, 10));
      } else if (message.startsWith('cashOut:')) {
        const cashOutTokens = message.split(':')[1];
        alert(`You cashed out with ${cashOutTokens} credits!`);
        setTokens(10); // Assuming starting tokens after cashing out
      }
    };

    ws.onclose = () => {
      if (tokens > 0) {
        sendMessage(`addTokens:${userName}:${tokens}`);
      }
    };

    return () => {
      ws.close();
    };
  }, [tokens]);

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
    if (tokens <= 0 || isSpinning) return; // Prevent roll if no tokens or spinning

    setTokens(prev => prev - 1);
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
      <button onClick={handleRoll} disabled={isSpinning || tokens <= 0} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Play!
      </button>
      <h1>Tokens: {tokens}</h1>
    </div>
  );
}

export default App;
*/


/*
import React, { useEffect, useState } from 'react';
import './SlotTable.css';

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
*/







