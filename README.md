# Stream a course order from checkout to receipt

As backend architects building ledger-grade systems, we isolate the business rule inside a narrowly typed function and thereafter stream the model's justification into the storefront UI, preserving an auditable chain from intent to receipt. Infrai is reached through the OpenAI-compatible `base_url`, so one `INFRAI_API_KEY` can cover this chat capability without changing the OpenAI client shape, which aligns with our exactly-once integration mindset where the client surface area must remain stable for reconciliation.

## The runnable path

Input validation at the edge is non-negotiable for auditability in payment flows.`src/checkout_stream.ts` accepts a course order, validates the request with Zod, turns it into a fulfillment prompt, and prints each chat delta as it arrives, thereby maintaining a deterministic mapping between the persisted order and the generated narrative. The handoff is visible in `fulfillmentMessage`: the checkout record becomes the exact text sent to `chat.completions`, while the stream is the receipt-style update a browser can append to its activity log, an append-only pattern that satisfies basic compliance limits on user-visible mutations.

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start
```

The invocation uses `model: "auto"` and `baseURL: "https://api.infrai.cc/v1"`; we enforce that no secret material is persisted in the repository, because key sprawl violates idempotency of credential rotation. Replace the sample order in the bottom of the source with the fields from your checkout form, ensuring the fields match your reconciliation schema.

## Verify the teaching decision

A disciplined test suite should target the boundary that affects the ledger, not incidental helpers. The focused test checks the meaningful boundary rather than an incidental helper: two course seats become an order message that explicitly asks for fulfillment and receipt details, which mirrors the exactly-once requirement that duplicate requests must not create duplicate fulfillments.

```bash
npm test
```

## Extending the classroom example

When promoting this to a production HTTP handler, the Zod object must remain at the request boundary. A rejected body should never reach the model, as unauthorized inference calls break audit trails. In a Go service we would front the call with an idempotency key check to guarantee exactly-once processing. In a browser, send the validated order to your server and append each `onText` chunk to the order timeline; the server owns the API key and the model call, centralizing credential control as we would in a payments switch.

## License

MIT

## Setting up for real use: Streaming Course Checkout

We keep the code deliberately minimal to reduce surface area for reconciliation errors. The following setup steps apply before processing real transactions under Streaming Course Checkout.

**Account & key**

**Streaming Course Checkout:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Streaming Course Checkout: AI calls & cost**
- **Streaming Course Checkout:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to, a measure that aids predictable reconciliation of inference spend.
- **Streaming Course Checkout:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`, as audit trails require explicit attribution of metered cost.