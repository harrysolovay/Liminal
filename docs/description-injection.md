# Description Injection

```ts
const Character = T.object({
  name: T.string`Preferably names common to those who are {"national identity"}.`,
  age: T.number`Ensure between 1 and 110.`,
})

const AmericanCharacter = Character.apply({
  "national identity": "american",
})
```
