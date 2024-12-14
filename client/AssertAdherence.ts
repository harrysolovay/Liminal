import { AssertionError } from "@std/assert"
import type Openai from "openai"
import { T } from "../core/mod.ts"
import { ResponseFormat } from "./ResponseFormat.ts"

export function AssertAdherence(
  openai: Openai,
): (value: unknown, assertion: string) => Promise<void> {
  return async (value, assertion) => {
    const stance = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Weigh in on whether the value is valid for the corresponding assertion.

Assertion: ${assertion}

Value: ${JSON.stringify(value, null, 2)}`,
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
