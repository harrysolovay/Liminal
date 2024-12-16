# OpenAI

## `ResponseFormat`

Create `ResponseFormat` for use with OpenAI clients.

```ts{1-3,7}
import Openai from "openai"
import { ResponseFormat, L } from "liminal"
declare const openai: Openai
const Contact = L.object({
  name: L.string,
  phone: L.number,
  email: L.string,
})
// ---cut---
const response_format = ResponseFormat("extract_contact_information", Contact)`
  The contact information extracted from the supplied text.
`

const contact = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  response_format,
  messages: [],
})
```

[^1]: [OpenAI structured output backend limitations](https://platform.openai.com/docs/guides/structured-outputs#supported-schemas).
