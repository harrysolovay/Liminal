---
prev:
  text: Getting Started
  link: /getting-started
next:
  text: Contracts
  link: /contracts
---

# Values

Liminal's representation of types are used to support a wide range of language features, such as
value instantiation, union member matching and persistent state declaration in contracts. This
document covers the very basics. We'll cover composite types such as `Struct`, `List`, `Mapping` and
`Union` in [Composite Types](/composite-types.md).

## Instantiation

Any Liminal type––`bool` for instance––contains a `new` method, with which you can lift native
JavaScript values into the Liminal context.

Let's create a boolean value using the corresponding `L.bool` type.

```ts
const value = L.bool.new(true)
```

> Note: we could also utilize `L.bool.true`.

## Conversion

Every Liminal type is encoded with information about other types from which it can be created or to
which it can be converted.

### Conversion From

In the case that a type can be created from another type, we can specify a value of the
from-convertible type as the argument to `new`.

In the case of integers, this may look as follows.

```ts
const u8 = L.u8.new(1)
const u16 = L.u16.new(u8)
const u32 = L.u32.new(u16)
```

### Conversion Into

This same example could be represented instead with `into`, which converts a value into the
specified compatible type.

```ts
const u8 = L.u8.new(1)
const u16 = u8.into(u16)
const u32 = u16.into(u32)
```

## Pure Methods

Liminal values contain pure methods specific to their respective types.

Let's make use of some basic integer operations.

```ts
const initial = L.u8.new(1) // 1

const added = initial.add(L.u8.new(2)) // 3

const subtracted = added.subtract(L.u8.new(1)) // 2

const multiplied = subtracted.multiply(L.u8.new(8)) // 16

const divided = subtracted.multiply(L.u8.new(4)) // 4
```

It is important to take note of method purity. Let's push an element to this list.

```ts
declare const u8s = L.List(L.u8).new()
```

```ts
u8s.push(L.u8.new(1))
```

We might expect for the `push` call to update the list in place. However, this is not the case.
Instead, `push` returns a new `L.List<L.u8>`, which represents the initial list with the `push` call
applied.

Let's save the updated list in a variable so that we can reference it in subsequent Liminal code.

```ts
const updatedU8s = u8s.push(L.u8.new(1))

updatedU8s.length
  .equals(u8s.length.add(1))
  .assert()
```

## Common Methods

There are several methods which exist for all types.

### `apply`

We can use `apply` to attach arbitrary metadata to any Liminal value. This is useful for the
development of libraries that transform the Liminal AST into some other target. If the transformer
requires some additional information not provided by Liminal core, developers can provide said
information via `apply`.

For example, we may want to specify public vs. private in the context of generating a rest API.

```ts
import { pub } from "liminal-rest-api"

// Treated as private by default.
export const privateValue = L.u8.new(1)

// Explicitly mark as public with the `apply` call.
export const publicValue = L.u8.new(1).apply(pub)
```

> Note: here we utilize a hypothetical `liminal-rest-api` library. This does not yet exist.

### `assign`

We use `assign` to represent updates to persistent storage.

```ts
export const count = L.u8.new(0)

export const increment = L.f(function*() {
  yield* count.assign(count.add(1))
})
```

We'll touch on this more deeply in [contracts](/contracts.md), as assignment touches on the
structure of a contract, as well as [`Effect`s](/effects.md).

### `equals`

The `equals` method accepts a value of the same type and returns a `bool` that represents whether
the two values are structurally equal.

```ts
const a = L.u8.new(1)
const b = L.u8.new(2)
const aEqualsB = a.equals(b)
```

### `is` and `match`

The `is` and `match` methods are used to reflect on the type of a union in order to model
union-member-specific handling. We'll cover these two methods more deeply in
[composite types](/composite-types.md).

```ts
declare const maybeU8: L.Union<L.u8 | L.None>

const isU8 = maybeU8.is(L.u8) // `L.bool`

const definitelyU8 = maybeU8.match(L.None, L.u8.new(1)) // `L.u8`
```

### `"?"`

The `"?"` method is used to turn a value into an `L.Effect`, a special construct of Liminal programs
which we'll cover in a later chapter. A quick rundown of effects is they allow us to model control
flow, with behavior similar to
[the Rust `try` trait](https://doc.rust-lang.org/std/ops/trait.Try.html) (and the `?` operator, used
as syntactic sugar).

```ts
declare const maybeU8: L.Union<L.u8 | L.None>

const handlesU8Case = L.f(function*() {
  const u8 = yield* maybeU8["?"](L.None)
  u8 // `L.u8`
})
```

When we call `handlesU8Case`, the result is an `L.Effect<L.None, L.u8>`. More on
[effects later](/effects.md).

## Atoms

### Booleans

The Liminal `L.bool` type can be used to instantiate a boolean value like so.

```ts
const value = L.bool.new(1)
```

An `L.bool` contains several methods.

#### `bool.not`

The `not` method can be used to represent negation of the `bool`.

```ts
const falsy = L.bool.new(true).not()
```

#### `bool.assert`

The `assert` method can be used to yield a value (usually a struct representing an error) in the
case that the value is falsy.

```ts
declare const isAuthorized: L.bool

function* usesAuthorization() {
  yield* isAuthorized.assert(NotAuthorizedError.new())
}
```

#### `bool.if`

The `if` method is used to branch depending on the truthiness of an `L.bool`.

```ts
export const count = L.u8.new(0)

function* increment() {
  const skipIncrement = L.bool.random()
  yield* skipIncrement.not().if(function*() {
    yield* count.assign(count.add(1))
  })
}
```

Note, the `if` method can also accept an arrow function, generator or value. The following is also
valid.

```ts
// ...

function* increment() {
  const skipIncrement = L.bool.random()
  yield* skipIncrement.not().if(
    count.assign(count.add(1)),
  )
}
```

#### `else`

We can chain `else` calls onto the results of our `if` calls.

```ts
export const count = L.u8.new(0)

function* update() {
  const shouldSubtract = L.bool.random()
  yield* count.assign(
    shouldSubtract
      .if(count.subtract(1))
      .else(count.add(1)),
  )
}
```

### Integers

Liminal exposes both signed and unsigned integer types ranging from 8 to 256 bits.

```ts
const one = L.u256.new(1)
```

The integer type also contains convenience `min` and `max` convenience values.

```ts
L.u256.max // 2 ** 256 - 1
L.i256.min // −2 ** 255
```

### Bytes

The `Bytes` type can be used to represent arbitrary data of known size.

```ts
class NftMetadata extends Bytes(32) {}

const nftMetadata = NftMetadata.new(new UInt8Array([...bytes]))
```

### None

The `None` type is used to represent the lack of a value (or `undefined` in the JavaScript context).

```ts
const maybeU8 = L.u8["?"]
```
