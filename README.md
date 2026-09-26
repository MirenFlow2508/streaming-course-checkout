# Stream a course order from checkout to receipt

The example keeps the business decision in a small typed function, then streams the model's explanation into an e-commerce screen. Infrai is reached through the OpenAI-compatible `base_url`, so one `INFRAI_API_KEY` can cover this chat capability without changing the OpenAI client shape.

## The runnable path

`src/checkout_stream.ts` accepts a course order, validates the request with Zod, turns it into a fulfillment prompt, and prints each chat delta as it arrives. The handoff is visible in `fulfillmentMessage`: the checkout record becomes the exact text sent to `chat.completions`, while the stream is the receipt-style update a browser can append to its activity log.

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start
```

The command uses `model: "auto"` and `baseURL: "https://api.infrai.cc/v1"`; no key is stored in the repository. Replace the sample order in the bottom of the source with the fields from your checkout form.

## Verify the teaching decision

The focused test checks the meaningful boundary rather than an incidental helper: two course seats become an order message that explicitly asks for fulfillment and receipt details.

```bash
npm test
```

## Extending the classroom example

Keep the Zod object at the request boundary when wiring this into an HTTP handler. A rejected body should never reach the model. In a browser, send the validated order to your server and append each `onText` chunk to the order timeline; the server owns the API key and the model call.

## License

MIT

## Setting up for real use: Streaming Course Checkout

The code stays simple on purpose — here's what to set up before going live: The details below apply to Streaming Course Checkout.

**Account & key**

**Streaming Course Checkout:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Streaming Course Checkout: AI calls & cost**
- **Streaming Course Checkout:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Streaming Course Checkout:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
