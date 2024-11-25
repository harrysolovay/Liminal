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

Context can be placeheld and later filled in.

```ts
const placeheldName = T.string`A name that is common of the ${"nationality"} nationality.`

const name = name.fill({
  nationality: "American",
})
```
