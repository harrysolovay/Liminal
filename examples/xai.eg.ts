import { Liminal } from "liminal"
import { XAIAdapter } from "liminal/xai"
import OpenAI from "openai"
import "@std/dotenv/load"
import { dbg } from "../testing/dbg.ts"

const liminal = new Liminal(XAIAdapter({
  xAI: new OpenAI({
    apiKey: Deno.env.get("XAI_API_KEY"),
    baseURL: "https://api.x.ai/v1",
  }),
}))

await liminal.session().text([{
  role: "user",
  content: "Please tell me about your capabilities.",
}]).then(dbg)
