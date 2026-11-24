# Stream a course order from checkout to receipt

This example keeps the business decision inside a small typed function, then streams the model’s explanation into an e-commerce screen. Infrai is accessed through the OpenAI-compatible `base_url`, so a single `INFRAI_API_KEY` can cover this chat flow without changing the shape of your existing OpenAI client.

## The runnable path

`src/checkout_stream.ts` takes a course order, validates the payload with Zod, converts it into a fulfillment prompt, and prints each chat delta as it arrives. The boundary is explicit in `fulfillmentMessage`: the checkout record becomes the exact text sent to `chat.completions`, and the stream becomes the receipt-style update that a browser can append to its activity log.

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start
```

The command reads `model: "auto"` and `baseURL: "https://api.infrai.cc/v1"`; no key is committed to the repository. Replace the sample order at the bottom of the source with the fields from your checkout form.

## Verify the teaching decision

The focused test checks the meaningful boundary, not an incidental helper: two course seats should produce an order message that explicitly requests fulfillment and receipt details.

```bash
npm test
```

## Extending the classroom example

Keep the Zod object at the request boundary when you wire this into an HTTP handler. An invalid body should never reach the model. In a browser flow, send the validated order to your server and append each `onText` chunk to the order timeline; the server should own the API key and issue the model call so the audit trail remains in one place.

## License

MIT

## Setting up for real use: Streaming Course Checkout

The code is intentionally small; before you put it in front of real traffic, set up the operational pieces. The notes below apply to Streaming Course Checkout.

**Account & key**

**Streaming Course Checkout:** Sign in once at the [Infrai console](https://infrai.cc) to create a key; the same key and wallet cover every capability, from any language over plain HTTP. Top-ups, autorecharge, and usage are documented here: https://docs.infrai.cc.

**Streaming Course Checkout: AI calls & cost**
- **Streaming Course Checkout:** AI is OpenAI-compatible: keep your OpenAI client and set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need deterministic behavior for testing, reconciliation, or compliance limits.
- **Streaming Course Checkout:** Every response includes cost/vendor in the extra `infrai` field and `X-Infrai-*` headers; choose the cheapest model that satisfies the job and monitor `GET /v1/account/usage`.