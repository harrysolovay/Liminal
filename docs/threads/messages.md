# Messages

## Create Messages

```ts
function* Hello() {
  yield "Hello, how are you today?" // User.

  const reply = yield* T.string // Assistant.

  reply satisfies string
}
```

```json
[
  {
    "role": "user",
    "body": "Hello, how are you today?"
    // ...
  },
  {
    "role": "system",
    "body": "I'm well, thank you for asking. How are you?"
    // ...
  }
]
```

> Note: the assistant message is implicitly added to the messages list.

## Relay Messages

```ts
function* Relayed() {
  yield* relay(save)
}

async function save(message: Message): Promise<void> {
  await writeFile(
    `./messages/${message.date.toString()}.json`,
    JSON.stringify(message),
  )
}
```

## Reduce Messages

```ts
function* LongThread() {
  // ... messages ...
  yield* reduce`Summarize the conversation.`

  // ... messages ...
  yield* reduce("Summarize the conversation.")

  // ... messages ...
  yield* reduce((messages) =>
    fetch(`https://your-reducer.com/api`, {
      method: "POST",
      body: JSON.stringify(messages),
    })
  )

  // ... messages ...
  yield* reduce(function*(messages) {
    yield "Summarize the conversation."
    yield "Emphasize the fantastical elements of the story."
    yield "Ensure detailed descriptions of all characters."
  })
}
```

### Common Reducer Patterns

```ts
import { branch, reduce, T } from "liminal"

function* Main() {
  // ... messages ...
  yield reduce(function*(messages) {
    yield "Synthesize the following texts into a single concise yet detailed text."
    yield* all(...messages.map((message, i) =>
      thread(i, function*() {
        yield "Extract key information from the following text."
        yield message
        return yield* T.string
      })
    ))
    return yield* L.string
  })
}
```

## Clear

```ts
import { clear } from "liminal"

function* Main() {
  // ... messages ...
  clear()
}
```

## Get Current Messages

```ts
function* G() {
  const messages = yield* list()

  messages satisfies Array<Message>
}
```
