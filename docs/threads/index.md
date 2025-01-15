# Threads

Threads are the core building blocks with which Liminal's executor operates. They are implemented as
generator functions that yield messages and actions (such as spawning child threads).

```ts
import { exec } from "liminal"

function* Main() {
  yield "What's your favorite color?"
  // ... conversation continues
}

// Execute the root thread
for await (const _ of exec(Main())) {}
```

Threads can:

- Buffer messages to be included with completion requests
- Create branches and child threads
- Branch into parallel subthreads
- Join multiple threads together
- Emit events for external observation
- Switch between models
- Use thread-scoped tools and message handlers
