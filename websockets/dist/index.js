"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const cookie_1 = __importDefault(require("cookie"));
const auth_token_1 = __importDefault(require("./utils/auth_token"));
const PORT = Number(process.env.websockets_port) || 8080;
const wss = new ws_1.WebSocketServer({ port: PORT }, () => {
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
const room_details = {};
wss.on("connection", (ws, request) => {
    console.log("New client connected");
    // Parse token from cookies
    const cookies = cookie_1.default.parse(request.headers.cookie || "");
    const token = cookies.token;
    if (!token) {
        ws.close(1008, "Unauthorized");
        console.log("No token found, connection closed.");
        return;
    }
    const token_data = (0, auth_token_1.default)(token);
    if (!token_data) {
        ws.close(1008, "Unauthorized");
        console.log("Invalid token, connection closed.");
        return;
    }
    const username_decoded = token_data.username;
    const user_id = token_data.user_id;
    ws.on("message", (data) => {
        let parsedData;
        try {
            parsedData = JSON.parse(data.toString());
            console.log("Received message:", parsedData);
        }
        catch (err) {
            console.error("Error parsing message:", err);
            return;
        }
        const roomId = parsedData.roomId;
        switch (parsedData.type) {
            case "create_room":
                if (!roomId) {
                    console.log("Room ID is required to create a room");
                    return;
                }
                if (room_details[roomId]) {
                    console.log("Room already exists");
                    return;
                }
                room_details[roomId] = new Set();
                room_details[roomId].add(ws);
                console.log(`Room ${roomId} created and user ${username_decoded} added`);
                break;
            case "join_room":
                if (!roomId) {
                    console.log("Room ID is required to join a room");
                    return;
                }
                const roomToJoin = room_details[roomId];
                if (!roomToJoin) {
                    console.log(`Room ${roomId} not found`);
                    return;
                }
                if (roomToJoin.has(ws)) {
                    console.log(`User already in room ${roomId}`);
                }
                else {
                    roomToJoin.add(ws);
                    console.log(`User ${username_decoded} joined room ${roomId}`);
                }
                break;
            case "chat":
                const message = parsedData.message;
                if (!roomId) {
                    console.log("Room ID is empty");
                    return;
                }
                const roomToChat = room_details[roomId];
                if (!roomToChat) {
                    console.log(`Room ${roomId} not found`);
                    return;
                }
                if (!roomToChat.has(ws)) {
                    console.log("Sender not in the room");
                    return;
                }
                // Broadcast to all other clients in the room
                for (const client of roomToChat) {
                    if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                        try {
                            client.send(JSON.stringify({ from: username_decoded, message }));
                        }
                        catch (err) {
                            console.error("Failed to send message", err);
                        }
                    }
                }
                break;
            default:
                console.log("Unknown message type:", parsedData.type);
        }
    });
    // Remove user from all rooms on disconnect
    ws.on("close", () => {
        console.log(`Client disconnected: ${username_decoded}`);
        for (const room of Object.values(room_details)) {
            room.delete(ws);
        }
    });
});
