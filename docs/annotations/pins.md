# Pins

Establish relationships between types to get semantically correct outputs with fewer shots

```ts
const Start = L.number()
const Range = L.object({
  start: A,
  end: L.number`Must be greater than ${Start}.`,
})
```
