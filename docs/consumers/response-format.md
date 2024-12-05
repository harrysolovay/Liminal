# `ResponseFormat`

Create `ResponseFormat` for use with OpenAI clients.

```ts{1-3,7} twoslash
import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
declare const openai: Openai
const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
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
