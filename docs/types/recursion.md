# Recursion

Recursive types are supported using `L.ref`. Recursive type inference, however, is not; this is due
to a limitation of the TypeScript language itself. This means we must be explicit when declaring
recursive types.

```ts {8,10} twoslash
import { L, Type } from "liminal"

interface Person {
  name: string
  friends: Array<Person>
}

const Person: Type<Person> = L.object({
  name: L.string,
  friends: L.array(L.ref(() => Person)),
})
```
