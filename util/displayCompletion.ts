import type Openai from "openai"

export async function displayCompletion(
  { usage, choices: [firstChoice] }: Openai.Chat.Completions.ChatCompletion,
  dest?: string,
) {
  const { finish_reason, message } = firstChoice!
  const { content } = message
  console.log(JSON.stringify({ usage, finish_reason, content }, null, 2))
  if (dest && content) await Deno.writeTextFile(dest, content)
}
