# Messages

## Create Messages

```ts
function* Hello() {
  // System.
  yield system`You are a cheery assistant.`

  // User.
  yield "Hello, how are you today?"

  // Assistant.
  const reply = yield* T.string
}
```

```json
[
  {
    "role": "system",
    "body": "You are a cheery assistant."
    // ...
  },
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
import { type Message, relay } from "liminal"

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
import { branch, L, reduce } from "liminal"

function* Main() {
  // ... messages ...
  yield reduce(function*(messages) {
    yield "Synthesize the following texts into a single concise yet detailed text."
    yield* join(...messages.map((message, i) =>
      thread(i, function*() {
        yield "Extract key information from the following text."
        yield message
        return yield* L.string
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
  yield* clear()
}
```

## Get Current Messages

```ts
function* G() {
  const messages = yield* list()

  messages satisfies Array<Message>
}
```
