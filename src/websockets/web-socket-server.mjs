import { WebSocketServer } from "ws";
let wss;

export function createWebSocketServer(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("WS Client connected. Total clients:", wss.clients.size);

    ws.on("message", (message) => {
      console.log("Received message:", message);
    });

    ws.on("close", () => {
      console.log("WS Client disconnected. Total clients:", wss.clients.size);
    });
  });

  return wss;
}
