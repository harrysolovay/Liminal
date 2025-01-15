# Branches

```ts
import { branch, L } from "liminal"

function* Parent() {
  yield "Why are you sad?"

  const reason = yield* branch("child", Child())

  console.log(reason)
}

function* Child() {
  yield "Ensure the reason has to do with the loss of true love."

  return yield* L.string
}
```

`parent`

```json
[
  {
    "role": "user",
    "body": "Why are you sad?"
  },
  {
    "role": "system",
    "body": "Because my dearest Ellen is in love with Nosferatu."
  }
]
```

`child`

```json
{
  {
    "role": "user",
    "body": "Why are you sad?",
  },
  {
    "role": "user",
    "body": "Ensure the reason has to do with the loss of true love."
  },
  {
    "role": "system",
    "body": "Because my dearest Ellen is in love with Nosferatu."
  }
}
```
