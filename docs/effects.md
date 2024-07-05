---
prev:
  text: Modules
  link: /modules
next:
  text: IDs
  link: /ids
---

# Effects

The Liminal `Effect` type allows us to model operations that have side effects, such as emitting
events, mutating state and asserting signer requirements. The `Effect` type has two type parameters:

## Example

Let's look at a concrete example of where we might use effects. In the following example, the
`maybeU8` function returns either an `L.u8` or an `L.None`.

```ts
const maybeU8 = L.f(
  L.bool
    .random()
    .if(L.u8.random())
    .else(L.none),
)
```

Not let's say that we have a `square` method that accepts an `L.u8` (not an `L.None`).

```ts
const square = L.f({ x: L.u8 }, ({ x }) => x.square())
```

If we want to utilize the result of `maybeU8`, we need to ensure it is not the `L.None` case.

```ts
const main = L.f(function*() {
  const v = maybeU8()
  return v
    .match(L.u8, (x) => square({ x }))
    .match(L.None, (x) => x)
})
```

When we utilize `maybeU8`, but only in the case that the value is an `L.u8`. Wherever we utilize
`maybeU8`, we can unhandle the `L.None` case like so.

```ts
const addsOneIfU8 = L.f(function*() {
  const definitelyU8 = yield* maybeU8()["?"](L.None)
  return definitelyU8.add(1)
})
```

Here, we've "unhandled" the `maybeU8`'s `L.None` result, which leaves us with an `L.u8`. We can now
use that `L.u8` directly without having to worry about the none case.

When we use `Effect`-producing functions such as `addsOneIfU8`, we can immediately re-yield their
effects.

```ts
const main = L.f(function*() {
  const definitelyU8 = yield* addsOneIfU8()
})
```

Alternatively, we could rehandle the `L.None` case and supplement a value.

```diff
const main = L.f(function*() {
  const definitelyU8 = yield* addsOneIfU8()
+   .catch(L.None, L.u8.new(1))
})
```

```ts
const add = L.f({
  a: L.u256,
  b: L.u256,
}, ({ a, b }) => a.add(b))
```

Here, the first argument we pass to `L.f` is a record of Liminal parameter types.

`L.f` can also be called without parameter specificity.

```ts
const addRandom = L.f(() =>
  L.u256
    .random()
    .add(L.u256.random)
)
```

We can also specify a generator function, which allows us to then yield values, which are our means
of modeling effects.

```ts
const addRandom = L.f(function*() {
  yield AddRandomEvent.new()
  return L.u256.random().add(L.u256.random)
})

class AddRandomEvent extends L.Struct({ tag: "AddRandomEvent" }) {}
```
