import OpenAI from "openai"
import "@std/dotenv/load"

const _openai = new OpenAI({
  apiKey: Deno.env.get("XAI_API_KEY"),
  baseURL: "https://api.x.ai/v1",
})
