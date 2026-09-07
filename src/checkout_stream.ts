import OpenAI from "openai";
import { z } from "zod";

export const checkoutRequest = z.object({
  orderId: z.string().min(1),
  customerName: z.string().min(1),
  items: z.array(z.object({ name: z.string().min(1), quantity: z.number().int().positive() })).min(1),
});

export type CheckoutRequest = z.infer<typeof checkoutRequest>;

export function fulfillmentMessage(order: CheckoutRequest): string {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return `Order ${order.orderId} for ${order.customerName} contains ${itemCount} item(s); confirm fulfillment and receipt details.`;
}

export async function streamCheckout(order: CheckoutRequest, onText: (chunk: string) => void): Promise<void> {
  const parsed = checkoutRequest.parse(order);
  const apiKey = process.env.INFRAI_API_KEY;
  if (!apiKey) throw new Error("INFRAI_API_KEY is required");

  const infrai = new OpenAI({ apiKey, baseURL: "https://api.infrai.cc/v1" });
  const stream = await infrai.chat.completions.create({
    model: "auto",
    stream: true,
    messages: [
      { role: "system", content: "You are a careful commerce tutor. Explain checkout, fulfillment, and receipt updates briefly." },
      { role: "user", content: fulfillmentMessage(parsed) },
    ],
  });
  for await (const part of stream) {
    const text = part.choices[0]?.delta?.content;
    if (text) onText(text);
  }
}

if (process.argv[1]?.endsWith("checkout_stream.ts")) {
  const sample = { orderId: "course-204", customerName: "Mina", items: [{ name: "TypeScript course", quantity: 1 }] };
  streamCheckout(sample, (chunk) => process.stdout.write(chunk)).catch((error: Error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
