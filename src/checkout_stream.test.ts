import test from "node:test";
import assert from "node:assert/strict";
import { checkoutRequest, fulfillmentMessage } from "./checkout_stream.js";

test("checkout decision names the fulfillment handoff and item count", () => {
  const order = checkoutRequest.parse({
    orderId: "order-7",
    customerName: "Ari",
    items: [{ name: "Algebra course", quantity: 2 }],
  });
  assert.equal(
    fulfillmentMessage(order),
    "Order order-7 for Ari contains 2 item(s); confirm fulfillment and receipt details.",
  );
});
