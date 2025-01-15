# Events

```ts
import { E, exec } from "liminal"

for await (const event of exec(Child())) {
  event satisfies {
    type: "info"
  } | {
    type: "error"
    value: {
      reason: string
    }
  }
}

function* Child() {
  yield E("info")

  if (Math.random() < 0.5) {
    yield E("error", {
      reason: "random",
    })
  }
}
```
