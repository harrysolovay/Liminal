# Advanced Typing

## Extract TypeScript Type

```ts
const AddParams = T.object({
  a: T.number,
  b: T.number,
})

function add({ a, b }: typeof AddParams["T"]) {
  return a + b
}
```

```ts twoslash
// @noErrors
// @esModuleInterop
console.error

console.gr
//        ^|
```

```ts twoslash
// @errors: 2339
const welcome = "Hi"
const words = welcome.contains(" ")
```
