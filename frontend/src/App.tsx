import { useEffect, useRef, useState } from 'react'
import './App.css'




function App() {

  const [socket , Setsocket] = useState();
  //@ts-ignore
  const inputRef = useRef();

  function sendMessage(){

    if(!socket){
       return
    }

    const message = inputRef.current.value;
    
    //@ts-ignore
    socket.send(message)

    

  }

  useEffect(()=>{

    const ws = new WebSocket("ws://localhost:8081")
    //@ts-ignore
    Setsocket(ws);

   ws.onmessage = (ev) =>{
      alert(ev.data);
   }


  } ,[])

  return (
    <div>
      
      <input type="text" ref={inputRef} placeholder='Message' />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default App
