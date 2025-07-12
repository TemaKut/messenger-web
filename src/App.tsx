import React, { useEffect, useRef } from 'react';

export default function App() {
  return (
    <div className="App">
      <Button/>
    </div>
  );
}


function Button() {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8000/ws');

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send('Hello Server!');
      console.log('Message sent');
    } else {
      console.log('WebSocket is not open yet.');
    }
  };

  return (
    <button onClick={sendMessage}>Send Message</button>
  );
}
