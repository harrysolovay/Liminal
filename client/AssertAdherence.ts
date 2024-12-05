import type Openai from "openai"
import { T } from "../core/mod.ts"
import { AssertionError } from "../util/mod.ts"
import { ResponseFormat } from "./ResponseFormat.ts"

export function AssertAdherence(
  openai: Openai,
): (
  value: number | string,
  assertion: string,
  ...assertions: string[]
) => Promise<void> {
  return async (value, ...assertions) => {
    const plurality = assertions.length > 1 ? "s" : ""
    const stance = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content:
          `Weigh in on whether the value is valid for the corresponding assertion${plurality}.

Assertion${plurality}: ${
            plurality
              ? `

- ${assertions.join("\n- ")}
`
              : assertions[0]!
          }

Value: ${value}`,
      }],
      response_format,
    }).then(response_format.into)
    if (stance.type === "Invalid") {
      throw new AssertionError(stance.value)
    }
  }
}

const Stance = T.taggedUnion("type", {
  Valid: undefined,
  Invalid: T.string`The reason.`,
})`Whether an assertion is valid.`

const response_format = ResponseFormat(
  "Stance",
  Stance,
)`Decide whether a statement about a value is correct.`
