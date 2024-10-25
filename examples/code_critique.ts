import { parseArgs } from "@std/cli"
import * as T from "structured-outputs"
import "@std/dotenv/load"
import { assert, unimplemented, unreachable } from "@std/assert"
import * as path from "@std/path"
import Openai from "openai"
import { logCompletion } from "../util/logCompletion.ts"

let { input, instructions } = parseArgs(Deno.args, {
  string: ["instructions"],
  collect: ["input"],
  alias: { input: "i" },
  default: {
    instructions: "Critique the following code. Ensure you adequately reference files and line numbers.",
  },
})

assert(input.length)

const documents: [string, string][] = await Promise.all(
  (input as string[]).flatMap(async function load(spec: string) {
    const p = path.resolve(spec)
    const stat = await Deno.stat(p)
    if (stat.isDirectory) {
      unimplemented()
    } else if (stat.isFile) {
      return Deno.readTextFile(p).then((contents) =>
        [path.relative(Deno.cwd(), p), contents] satisfies [string, string]
      )
    }
    unreachable()
  }),
)

while (documents.length) {
  const [filename, contents] = documents.shift()!
  instructions = instructions
    + `\n\n\`${filename}\`\n\n${contents.split("\n").map((v, i) => `${i + 1} | ${v}`).join("\n")}`
}

class Suggestion extends T.object(
  "A container for information related to a replacement suggestion.",
  {
    file: T.string(
      "The file containing the span to be potentially replaced.",
    ),
    startLine: T.number(
      "The line on which the potentially-to-be-replaced span starts.",
    ),
    endLine: T.number(
      "The line on which the potentially-to-be-replaced span ends.",
    ),
    what: T.string(
      "The suggestion for the replacement.",
    ),
    why: T.string(
      "The reason for suggesting the replacement",
    ),
    code: T.string(
      "The replacement code.",
    ),
  },
) {}

class Root extends T.object(
  undefined,
  {
    suggestions: T.array(
      "A list of replacement suggestions.",
      Suggestion,
    ),
  },
) {}

const openai = new Openai({ apiKey: Deno.env.get("OPENAI_API_KEY") })
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{
    role: "user",
    content: instructions,
  }],
  response_format: T.ResponseFormat(
    "suggest_replacements",
    "offer replacement suggestions for specific spans of the provided files.",
    { Suggestion, Root },
    "Root",
  ),
})

logCompletion(completion)
