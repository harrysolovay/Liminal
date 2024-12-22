# Pins

By mentioning in the prompt the type that another type references, you’re more likely to get it
right in one shot

Establish relationships between types to get semantically correct outputs with fewer shots

```ts
const Start = L.number()
const Range = L.object({
  start: A,
  end: L.number`Must be greater than ${Start}.`,
})
```
