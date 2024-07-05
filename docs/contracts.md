---
prev:
  text: Values
  link: /values
next:
  text: Effects
  link: /effects
---

# Contracts

Liminal-based contracts are just objects containing Liminal values and Liminal functions.

```ts
const count = L.u256.new(0)

const counterContract = {
  count,
  increment: L.f(function*() {
    // Calculate the incremented count.
    const next = count.add(1)
    // Assign `next` to `count` and returns the previous value.
    return yield* count.assign(next)
  }),
}
```

## Modules and Namespace-importing

We can also use treat modules as objects, which allows us to define a contract like so.

`Counter.contract.ts`

```ts
import * as L from "liminal"

export const count = L.u256.new(0)

export const increment = L.f(function*() {
  // ...
})
```

Consumers of this contract can then namespace-import the contract.

```ts
import * as Counter from "./Counter.contract.ts"

declare const contractId: L.id

const contract = contractId.bind(Counter)
```

## Composition

We can import and utilize Liminal values and functions between modules.

For example, we may want to reuse the counter module to vend integers to serve as unique identifiers
within an NFT collection. Here we utilize the `increment` function defined within `count.ts`. Note,
the `increment` function interacts with the `count` value, which also lives inside of the `count.ts`
module.

`Nfts.contract.ts`

```ts
import * as L from "liminal"
import { increment } from "./count.ts"

export class Metadata extends L.Bytes(32) {}
export class Nfts extends L.Mapping(L.u256, Metadata) {}

export const owner = L.id.fromHex("0x...")
export const nfts = Nfts.new()

export const create = L.f({ Metadata }, function*({ Metadata }) {
  // Ensure the caller has permission to create an NFT.
  yield* L.sender.equals(owner).assert()
  // Incrementing the count returns the previous (we'll use this as the ID).
  const id = yield* increment()
  // Represent the updated `nfts` map.
  const updated = nfts.set(id, Metadata)
  // Assign the updated map to `nfts`.
  yield* nfts.assign(updated)
})
```

Later on, when we want to deploy or interact with our contract, we can compose the modules into a
Liminal contract object with destructuring.

```ts
import * as Counter from "./Counter.contract.ts"
import * as Nfts from "./Nfts.contract.ts"

const contract = { ...Counter, ...Nfts }
```

### Pattern Libraries

Pattern libraries are another means of composing contracts. At a high level, pattern libraries allow
us to encapsulate state and functionality, potentially in a way that is configurable for end
developers.

For example, an NFTs pattern library may allow developers to produce Liminal contract objects like
so.

```ts
import { Nfts } from "liminal/std/nfts"

export const contract = Nfts({
  owner: L.id.fromHex("0x..."),
  title: L.Bytes(8).new(
    new TextEncoder().encode("My NFT Collection"),
  ),
  metadata: L.Bytes(32).new(
    new TextEncoder().encode(JSON.stringify({
      uri: "https://ipfs.filebase.io/ipfs/...",
      // ...misc
    })),
  ),
})
```

Pattern libraries do not need to produce entire contracts; they may also expose constructs to be
utilized within the end developers' contracts.

```ts
import { Counter } from "liminal/std/counter"

export const counter = Counter.new()

export const usesCounter = L.f(function*() {
  const count = yield* counter.next()
  // Make use of `count`...
})
```

## `L.f` Parameters

It is possible to create Liminal functions with or without parameters.

In the case that the function needs to accept arguments, we supply a record of Liminal types as the
first argument to `L.f`.

```ts
const add = L.f(
  { a: L.u8, b: L.u8 },
  ({ a, b }) => a.add(b),
)
```

Let's refactor this example such that `a` and `b` are global state.

```ts
const a = L.u8.new(1)
const b = L.u8.new(2)

const add = L.f(() => a.add(b))
```

## `Call`s

Let's look at how else we might write our "calls," aka. the statement of which our function is
comprised.

### Values

If a function accepts no arguments and is meant to simply return a value, we can provide that value
with no wrapper function.

Let's refactor the `add` example from above to specify a "value call."

```diff
- const add = L.f(() => a.add(b))
+ const add = L.f(a.add(b))
```

### Arrow Functions

In the case that a function accepts some arguments but does not yield any effects, we can provide an
arrow function.

For example, let's create a `square` method.

```ts
const add = L.f({ x: L.u8 }, ({ x }) => x.square())
```

### Generators

### Generators Functions
