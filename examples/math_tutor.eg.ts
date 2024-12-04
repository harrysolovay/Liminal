import Openai from "openai"
import { ResponseFormat, T } from "structured-outputs"
import "@std/dotenv/load"
import { dbg } from "../util/mod.ts"

// adapted from https://cookbook.openai.com/examples/structured_outputs_intro#example-1-math-tutor
const response_format = ResponseFormat(
  "math_reasoning",
  T.object({
    steps: T.array(T.object({
      explanation: T.string,
      output: T.string,
    })),
    final_answer: T.string,
  }),
)

await new Openai().chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful math tutor. Guide the user through the solution step by step.",
      },
      {
        role: "user",
        content: "How can I solve 8x + 7 = -23?",
      },
    ],
    response_format,
  })
  .then(response_format.into)
  .then(dbg("Math solution:"))
