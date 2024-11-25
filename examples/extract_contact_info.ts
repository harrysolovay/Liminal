import { ResponseFormat, T } from "structured-outputs"
import { openai } from "./_common.ts"

const Contact = T.object({
  name: T.string,
  phone: T.number,
  email: T.string,
})

const response_format = ResponseFormat("extract_contact_information", Contact)`
  The contact information extracted from the supplied text.
`

const contact = await openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    response_format,
    messages: [
      {
        role: "user",
        content: [{
          type: "text",
          text: `
            Extract data from the following message:

            Please call John Doe at 555-123-4567 or email him at john.doe@example.com.
          `,
        }],
      },
    ],
  })
  .then(response_format.parseFirstChoice)

console.log(contact)
