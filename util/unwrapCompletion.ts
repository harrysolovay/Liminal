import type Openai from "openai"
import * as path from "@std/path"

export async function unwrapCompletion({
  usage,
  choices: [firstChoice],
}: Openai.Chat.Completions.ChatCompletion) {
  if (!firstChoice) throw 0
  const { finish_reason, message } = firstChoice
  const { content } = message
  console.log(JSON.stringify({ usage, finish_reason, content }, null, 2))
  if (!content) throw 0
  await Deno.writeTextFile(
    path.join(Deno.cwd(), ".completions", `${new Date().toISOString()}.json`),
    content,
  )
}
