# Pattern Libraries

## Functions

We can create functions that return Liminal functions and values to be used elsewhere. We could even
return a complete Liminal contract object.

```ts
export function Nfts<Y extends L.Value>(
  owner: L.id,
  increment: L.F<[], Y, L.u256>,
) {
  const nfts = Nfts.new()
  const create = L.f({ Metadata }, function*({ Metadata }) {/* ... */})

  return { nfts, create }
}
```

## Liminal Subtypes

We can also subtype Liminal types and implement methods that operate on those types. For example,
let's implement a `U256Range`, which allows us to safely iterate over all values between `0` and
`2^256 - 1`.

`U256Range.ts`

```ts
export class U256Range extends L.Struct({
  count: L.U256,
  maxReached: L.bool,
}) {
  *next() {
    // Yield the error if max reached.
    yield* this.fields.maxReached.not().assert(MaxReachedError.new())
    // Calculate the next count.
    const nextCount = this.fields.count.add(1)
    // Potentially mark `maxReached` as true.
    yield nextCount.equals(L.u256.max).if(this.fields.maxReached.assign(true))
    // Create the new count state, return the previous.
    return yield* this.fields.count.assign(nextCount)
  }
}

export class MaxReachedError extends L.Struct({ tag: "MaxReachedError" }) {}
```

One can now utilize the `U256Range` pattern like so.

`Nfts.contract.ts`

```ts
import { U256Range } from "./U256Range.ts"

export const range = U256Range.new()

export const create = L.f({/*...*/}, function*({/*...*/}) {
  // ...
  const id = yield* range.increment()
  // ...
})
```

Meanwhile, all of the state and effectful operations are encapsulated in the `U256Range` instance.
