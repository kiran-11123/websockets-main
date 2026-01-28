import { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import cookie from 'cookie'
import checkUser from "./utils/auth_token.js";
const PORT = process.env.websockets_port || 8080;





const wss = new WebSocketServer({ port: PORT }, () => {
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});


const all_user_data = []; // Array to store all user data including their WebSocket connections

wss.on("connection", (ws , request) => {
    console.log("New client connected")

    const cookies = cookie.parse(request.headers.cookie || "");

    const token = cookies.token;


if (!token) {
    ws.close(1008, "Unauthorized");
    console.log("No token found, connection closed.");
    return;
}

const token_data = checkUser(token);

console.log(token_data);

if(token_data === null){
      ws.close(1008, "Unauthorized");
    console.log("No token found, connection closed.");
    return;
}
    

const username_decoded = token_data.username;
const user_id = token_data.user_id;

  all_user_data.push({
    user: user_id,
    username : username_decoded,
    rooms: [],
    ws,
  });

     ws.on('message', (data) => {

        let parsedData;
        try {
            parsedData = JSON.parse(data);
            console.log('Received message:', parsedData);
        } catch (err) {
            console.error('Error handling message:', err);
        }

         
        if (parsedData.type === 'join_room') {
            const user = all_user_data.find(u => u.ws === ws);
            if (!user) return;

            if (!user.rooms.includes(parsedData.roomId)) {
                user.rooms.push(parsedData.roomId);
            }
        }


        else if (parsedData.type === "chat") {
       const roomName = parsedData.roomId;
     const message = parsedData.message;

  console.log("message received:", message);
  console.log("room name:", roomName);

  console.log("all users data:", all_user_data);    

  const sender = all_user_data.find(u => u.ws === ws);
if (!sender) return; 
    
all_user_data.forEach((user) => {
  if (user.rooms.includes(roomName) && user.ws !== sender.ws) {
    console.log("message sent to", user.username);
    user.ws.send(JSON.stringify({
      from: sender.username,
      room: roomName,
      message,
    }));
  }
});

 
}

    });

});