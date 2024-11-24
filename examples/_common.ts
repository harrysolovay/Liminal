import Openai from "openai"
import "@std/dotenv/load"
import { tap } from "../util/tap.ts"
import { ensureDir } from "@std/fs"

export const openai = new Openai({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
})

export const dbg = tap(async (value) => {
  await ensureDir(".tmp")
  await Deno.writeTextFile(`.tmp/${Date.now()}.json`, JSON.stringify(value, null, 2))
})
