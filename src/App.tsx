import React, { use, useEffect, useRef } from 'react';
import {Request, UserRegisterRequest} from 'client-proto/gen/ts/request_pb';
import {Response} from 'client-proto/gen/ts/response_pb';

export default function App() {
  return (
    <div className="App">
      <Button/>
    </div>
  );
}

  // FIXME - всё что имеется в этой фукнции - исключительно для тестов 
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

    socketRef.current.onmessage = async (event) => {
      let arrayBuffer: ArrayBuffer;

      if (event.data instanceof Blob) {
        arrayBuffer = await event.data.arrayBuffer(); 
      } else {
        arrayBuffer = event.data;
      }

      const responseBytes = new Uint8Array(arrayBuffer);
      console.log("Response -> ", Response.deserializeBinary(responseBytes).toObject())
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      var request = new Request();
      request.setId(334);

      let userRegisterRequest = new UserRegisterRequest();

      userRegisterRequest.setName('Artem');
      userRegisterRequest.setLastName('Kutuzov');
      userRegisterRequest.setEmail('tema.kutuzzzov@email.ru')
      userRegisterRequest.setPassword('12345678');


      request.setUserRegister(userRegisterRequest);


      console.log('Send request ->', request.toObject());
      socketRef.current.send(request.serializeBinary());
    } else {
      console.log('WebSocket is not open yet.');
    }
  };

  return (
    <button onClick={sendMessage}>Send Message</      button>
  );
}
