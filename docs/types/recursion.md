# Recursion

Recursive types are supported using `T.deferred`. Recursive type inference, however, is not (due to
a current limitation of TypeScript). Because of this limitation, we must explicitly type recursive
types.

```ts {8,10} twoslash
import { L, Type } from "liminal"

type Person = {
  name: string
  friends: Person[]
}

const Person: Type<Person> = L.object({
  name: L.string,
  friends: L.array(L.ref(() => Person)),
})
```
