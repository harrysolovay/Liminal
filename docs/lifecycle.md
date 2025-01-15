# Lifecycle

## Root and Child Threads

Threads are the fundamental building blocks of a Liminal application. They are implemented as sync
or async generator functions (or any iterator for that matter).

```ts
import { create, relay, system } from "liminal"
import { yourModel } from "./models.ts"

function* Main() {
  // Set the model for this thread.
  yield yourModel

  // Attach a handler that receives all messages of the current thread (not children).
  yield relay((message) => {
    console.log(message)
  })

  // Perhaps use `relay` specify how to save messages to an external database.
  yield relay((message) => {
    await sql`INSERT INTO messages (role, body) VALUES (${message.role}, ${message.body})`
  })

  // Specify a system prompt.
  yield system`Your system instructions here.`

  // Create child threads.
  yield* create("child", ChildThread())
}
```

## Model Configuration

Model must be configured in order to yield assistant messages. However, model can be changed at any
point in the thread lifecycle. Child threads inherit the model of their parent unless overridden.

```ts
import { create } from "liminal"
import { model } from "liminal/openai"
import OpenAI from "openai"

const openai = new OpenAI()

function* Main() {
  // Set model for this thread
  yield model(openai, "gpt-4o-mini")

  // Child threads inherit gpt-4o-mini.
  yield* create("child", ChildThread())
}
```

## Message Flow

> Whenever creating child threads, it is important to note that any message relayers are not
> inherited.

### Thread Creation and Message Inheritance

There are three ways to spawn new threads, each with different behavior:

```ts
import { branch, create, join } from "liminal"

function* Main() {
  yield "What's your favorite color?"

  // `create` a child thread with an empty message list.
  yield* create("fresh", Fresh())

  // `branch` the current thread into a new thread (which inherits the current thread's message list).
  yield* branch("variant", Variant())

  // `join` multiple threads into one.
  // Results of each child thread are returned as a tuple.
  // Events of each child thread are emitted.
  const [resultA, resultB] = yield* join(
    create("A", ThreadA()),
    create("B", ThreadB()),
  )
}
```

1. `create()`: Starts a fresh thread with an empty message list
   - Clean slate for new conversations
   - No inherited context from parent
   - Useful for independent subtasks

2. `branch()`: Inherits the parent thread's entire message list
   - Maintains full conversation context
   - Useful for exploring variations or alternatives
   - Enables parallel exploration of different conversation paths

3. `join()`: Combines multiple threads into a single thread
   - Executes threads concurrently
   - Returns results as a tuple
   - Can mix and match `create` and `branch` within join
   - Useful for parallel tasks that need to be treated as one unit

### Message Compression with `reduce`

The `reduce` role is specifically designed for incremental message list compression:

```ts
function* Thread() {
  // ... conversation progresses ...

  // Compress previous messages into a summary
  yield reduce`Extract the most relevant information from the conversation.`

  // Future LLM calls will see the compressed summary instead of the full history
  // This helps manage input token usage while preserving context
}
```

Key aspects of message flow:

1. Messages are immutable once added to a thread
2. Each message has a role: `system`, `user`, `assistant`, or `reducer`
3. The `reducer` role may be converted back into a `user` when submitted to the LLM (this is
   provider-specific).
4. Return values from child threads are automatically appended to parent message lists.

## Thread Execution

Root threads are executed using the `exec` function, which returns an async generator of events:

```ts
import { exec } from "liminal"

for await (const event of exec(Main())) {
  console.log(event)
}
```

## Best Practices

1. **Thread Organization**
   - Use meaningful thread IDs for debugging and monitoring
   - Structure threads hierarchically for complex conversations

2. **State Management**
   - Similar to React components, it's best to keep state local to the threads that utilize that
     state.
   - Meanwhile, it's best to use events as the mechanism for mutating external state.

3. **Model Selection**
   - Configure models at appropriate levels in the thread hierarchy
   - Use model switching for specialized tasks
