import OpenAI from "openai"
import "@std/dotenv/load"
import { assert, L, Liminal, OpenAIAdapter } from "liminal"

const $ = Liminal(OpenAIAdapter({
  openai: new OpenAI({
    apiKey: Deno.env.get("XAI_API_KEY"),
    baseURL: "https://api.x.ai/v1",
  }),
}))

const how = await $("How are you today?")(L.string)

await assert(L.string, how)
