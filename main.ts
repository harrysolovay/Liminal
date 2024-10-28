import { parseArgs } from "@std/cli"
import * as T from "./mod.ts"
import "@std/dotenv/load"
import { assert } from "@std/assert"
import * as fs from "@std/fs"
import * as path from "@std/path"
import Openai from "openai"
import { displayCompletion } from "./util/displayCompletion.ts"

let {
  input,
  instructions,
  output,
  "models-module": modelsModule,
  "root-model": rootModel,
  exclude,
  o1,
  "line-numbers": lineNumbers,
} = parseArgs(Deno.args, {
  boolean: ["o1", "line-numbers"],
  string: ["instructions", "output", "models-module", "root-model"],
  collect: ["input", "exclude"],
  alias: {
    input: "i",
    output: "o",
    "models-module": "m",
    "root-model": "r",
    exclude: "e",
  },
  default: {
    instructions: "You're an expert systems engineer. Provide feedback on the following.",
    "root-model": "default",
    exclude: [
      ".git",
      "node_modules",
      "target",
      "deno.lock",
      ".env",
    ],
  },
})

assert(input.length)

const documents = await Promise.all(
  (input as string[]).map(async function load(spec: string) {
    const p = path.resolve(spec)
    const include: string[] = []
    const stat = await Deno.stat(p)
    if (stat.isDirectory) {
      const skip = (exclude as string[]).map((v) => path.globToRegExp(path.join(Deno.cwd(), v)))
      for await (
        const { path: srcPath } of fs.walk(p, {
          includeDirs: false,
          followSymlinks: true,
          skip,
        })
      ) include.push(srcPath)
    } else include.push(p)
    return await Promise.all(
      include.map((p) =>
        Deno.readTextFile(p).then((contents) => [path.relative(Deno.cwd(), p), contents] satisfies [string, string])
      ),
    )
  }),
).then((v) => v.flat())

while (documents.length) {
  const [filename, contents] = documents.shift()!
  instructions = instructions
    + `\n\n\`${filename}\`\n\n${
      lineNumbers
        ? contents.split("\n").map((v, i) => `${i + 1} | ${v}`).join("\n")
        : contents
    }`
}

const response_format = await (async () => {
  if (modelsModule) {
    const models = await import(modelsModule)
    if (!models[rootModel]) throw 0
    return T.ResponseFormat(
      "suggest_replacements",
      "offer replacement suggestions for specific spans of the provided files.",
      models,
      rootModel,
    )
  }
})()

const openai = new Openai({ apiKey: Deno.env.get("OPENAI_API_KEY") })
const completion = await openai.chat.completions.create({
  model: o1 ? "o1-preview" : "gpt-4o",
  messages: [
    {
      role: "user",
      content: instructions,
    },
  ],
  response_format,
})

await displayCompletion(completion, output)
