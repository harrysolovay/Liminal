---
prev:
  text: Effects
  link: /effects
next:
  text: Composite Types
  link: /composite-types
---

# IDs

An `id` is a public key. It can be created from a `UInt8Array` of the public key's bytes.

```ts
const value = L.id.new(new UInt8Array([...bytes]))
```

Alternatively, there is a `fromHex` convenience method for creating an `id` from a hex-string
representation of the public key bytes.

```ts
const value = L.id.fromHex(hexString)
```

Any `id` can be used to create a `signer<K>`, which is a subtype of `id` with a _key_ difference:
the `id` subtype is associated with a property key, which can be communicated within the type system
to enforce a signer requirement.

In the following example, we intend to deploy a contract at `contractId`. We'll need the ability to
sign on behalf of that `id`. Let's ensure that the contract signer requirement is communicated
within the deployment transaction type.

```ts
// @errors: 2339
const contractId = L.id.fromHex(process.env.CONTRACT_ID)

L
  .tx(function*() {
    const signer = yield* contractId.signer("contract")
    yield* signer.deploy(namespace, /* ...rest */ {})
  })
  .sign(senderSigner, {})
```

To fix this error, supply the signer under the tx-specified key `"contract"`.

```diff
L
  .tx(function*() { /* ... */ })
- .sign(senderSigner, {})
+ .sign(senderSigner, {
+   contract: contractSigner,
+ })
```
