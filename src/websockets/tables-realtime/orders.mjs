import { supabase } from "../../db/supabase.mjs";
import { broadcastToClients } from "../brodcast-helper.mjs";

export function subscribeOrdersRealtime() {
  const subscription = supabase
    .channel("public:orders")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      (payload) => {
        console.log("Orders change received:", payload);
        broadcastToClients(payload); // send to all WS clients
      },
    )
    .subscribe((status) => {
      console.log("Subscription status:", status);
    });

  return subscription;
}
