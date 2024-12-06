# Types Overview

The core construct of Structured Outputs TypeScript is a `Type`.

Types and type factories can be accessed off of the root export `T`.

```ts twoslash
// @noErrors
import { T } from "structured-outputs"

T.
//^|
```

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

## Signature

Every `Type` shares the following signature.

```ts
Type<T, K extends keyof any = never>
```

### `T`

The native TypeScript type.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
type T = typeof T.number["T"]
//   ^?
```

<br />

### `P`

Any context parameter keys yet to be applied. For example:

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Reply = T.string`Reply to: "Hello ${"subject"}."`
//    ^?
```

<br />

`P` defaults to `never` (the state in which there are no unfilled parameters).

> See [context parameters](../context/parameters.md)

## `TypeInfo`

Each type has a corresponding JSON-compatible representation called `TypeInfo`. This representation
can be used to transport types between environments.

### Serialize

Types implement `toJSON`, which enables direct use within `JSON.stringify`.

```ts twoslash
import { T } from "structured-outputs"
// ---cut---
const Characters = T.array(
  T.object({
    name: T.string`The character's name.`,
  }),
)`A list of characters in a story.`

const typeInfo = JSON.stringify(Characters, null, 2)
```

The resulting JSON representation looks as follows.

```json
{
  "type": "array",
  "value": {
    "description": "A list of characters in a story.",
    "element": {
      "type": "object",
      "value": {
        "fields": {
          "name": {
            "type": "string",
            "value": {
              "description": "The character's name."
            }
          }
        }
      }
    }
  }
}
```

> Note: in order to JSON-serialize a type, all of its parameters must be filled. See
> [issue #51](https://github.com/harrysolovay/structured-outputs/issues/51).

### Deserialize

We can use `deserializeType` to turn a `TypeInfo` object back into a `Type`.

```ts twoslash
import { TypeInfo } from "structured-outputs"
declare const typeInfo: TypeInfo
// ---cut---
import { deserializeType } from "structured-outputs"

const type = deserializeType(typeInfo)
//    ^?
```

<br />

## Custom Inspect

The unadulterated `Type` inspect result is quite dense, as it is a callable object containing
numerous values that most developers need not be aware. To simplify viewing `Type`s in the console,
there is a custom inspect that displays the type in a more compact form.

For example, let's look at the console log resulting from the following.

```ts
import { T } from "structured-outputs"

const A = T.object({
  a: T.string,
})

const B = T.taggedUnion("type", {
  A,
  B: T.string,
})

console.log(B)
```

The resulting console log approximates the TypeScript definition.

```ts
T.taggedUnion("type", {
  A: T.object({ a: T.string }),
  B: T.string,
})
```
