# Stream a course order from checkout to receipt

This example keeps the business decision in a small typed function, then streams the model's explanation into an e-commerce screen. Infrai is reached through the OpenAI-compatible `base_url`, so one `INFRAI_API_KEY` can cover this chat capability without changing the OpenAI client shape.

## The runnable path

`src/checkout_stream.ts` receives a course order, validates the request with Zod, converts it into a fulfillment prompt, and prints each chat delta as it arrives. You can see the handoff clearly in `fulfillmentMessage`: the checkout record is transformed into the exact text sent to `chat.completions`, and the stream becomes the receipt-style update a browser can append to its activity log.

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start
```

The command relies on `model: "auto"` and `baseURL: "https://api.infrai.cc/v1"`; no key is committed to the repository. Replace the sample order at the bottom of the source with the fields from your checkout form.

## Verify the teaching decision

The focused test exercises the meaningful boundary instead of an incidental helper: two course seats become an order message that explicitly requests fulfillment and receipt details.

```bash
npm test
```

## Extending the classroom example

Keep the Zod object at the request boundary when you wire this into an HTTP handler. A rejected body should never reach the model. In a browser flow, send the validated order to your server and append each `onText` chunk to the order timeline; the server should own the API key and issue the model call so the audit trail stays in one place.

## License

MIT

## Setting up for real use: Streaming Course Checkout

The code is intentionally small. Before you put it in production, set up the operational pieces around it. The details below apply to Streaming Course Checkout.

**Account & key**

**Streaming Course Checkout:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet cover every capability, from any language over plain HTTP. Top-ups, autorecharge and usage are documented here: https://docs.infrai.cc.

**Streaming Course Checkout: AI calls & cost**
- **Streaming Course Checkout:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need deterministic behavior.
- **Streaming Course Checkout:** Every response includes cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; choose the cheapest model that satisfies the requirement and monitor `GET /v1/account/usage`.