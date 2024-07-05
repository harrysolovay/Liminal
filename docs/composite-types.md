---
prev:
  text: IDs
  link: /ids
next:
  text: Transactions
  link: /transactions
---

# Composite Types

## Structs

Structs let one define event types for both proving and interpretation within a given transaction
runtime.

Let's define a a struct to represent a balance transfer event.

```ts
class TransferEvent extends L.Struct({
  tag: "Transfer",
  amount: L.u256,
  from: L.id,
  to: L.id,
}) {}
```

> Note: the `tag` field is a constant value (a property key). This means it is constant across all
> instances of `TransferEvent`.

Let's create a new `TransferEvent` within the following hypothetical transfer method.

```ts
function* transfer() {
  const { amount, to } = yield L.use({ amount: L.u256, to: L.id })

  // Create the new `TransferEvent`.
  const event = TransferEvent.new({
    amount,
    from,
    to: L.sender,
  })

  // Yield the `TransferEvent`.
  yield event
}
```

When we ultimately execute a transaction that yields our event, we can supply a callback that
accepts the event as represented within JavaScript.

```ts
L
  .tx(function*() {
    yield* L.call(contract.transfer, {
      amount: L.u256.new(1e9),
      to: L.id.fromHex(process.env.RECIPIENT_ID),
    })
  })
  .sign(senderSigner)
  .run((event) => {
    //  ^?
  })
```

## `Union`s

TODO: describe native representation

```ts
const value = L.union(value, "")
```

## `List`s

## `Mapping`s

The behavior of `MerkleMap` and `MerkleList` is yet to be fleshed out. Their methods could be
modeled in a non-mutative manner. For instance, pushing to a `MerkleList<u8>` might return a new
`MerkleList<u8>`.

```ts
const initial = L.MerkleList(L.u8).new()
const withElement = initial.push(L.u8.new(1))
```
