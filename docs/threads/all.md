# All

```ts
import { all, branch } from "liminal"

function* Parent() {
  yield "How are you today?"
  const [happy, sad] = yield* all(
    branch("happy", Child()),
    branch("sad", Child()),
  )
}

function* Child(tone: string) {
  yield `Ensure the tone is ${tone}.`
  return yield* L.string
}
```

`parent`

```json
[
  {
    "role": "user",
    "body": "How are you today?"
  },
  {
    "role": "subthreads",
    "results": {
      "happy": "I'm doing fantastic! Thank you for asking. How are you?",
      "sad": "I'm not doing well. Leave me alone."
    }
  }
]
```

`happy_child`

```json
[
  {
    "role": "user",
    "body": "How are you today?"
  },
  {
    "role": "user",
    "body": "Ensure the tone is happy."
  },
  {
    "role": "system",
    "body": "I'm doing fantastic! Thank you for asking. How are you?"
  }
]
```

`sad_child`

```json
[
  {
    "role": "user",
    "body": "How are you today?"
  },
  {
    "role": "user",
    "body": "Ensure the tone is sad."
  },
  {
    "role": "system",
    "body": "I'm not doing well. Leave me alone."
  }
]
```
