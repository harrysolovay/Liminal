import OpenAI from "openai"
import "@std/dotenv/load"
import { chunks, index } from "./common.eg.ts"

const openai = new OpenAI()

const { data } = await openai.embeddings.create({
  input: "Eating delicious food on the train.",
  model: "text-embedding-ada-002",
})

const { matches } = await index.query({
  vector: data[0]!.embedding,
  topK: 5,
})

matches.forEach((match) => {
  console.log(`## ${match.id}`)
  console.log(chunks[parseInt(match.id)])
  console.log("\n\n")
})
