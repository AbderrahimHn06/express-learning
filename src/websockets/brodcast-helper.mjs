// Broadcast helper
import { wss } from "../server.mjs";

export function broadcastToClients(data) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(JSON.stringify(data));
  });
}
