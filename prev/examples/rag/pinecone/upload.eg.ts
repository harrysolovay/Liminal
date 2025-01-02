import "@std/dotenv/load"
import { chunk } from "@std/collections"
import OpenAI from "openai"
import { chunks, index } from "./common.eg.ts"

const openai = new OpenAI()

const embeddings = await openai.embeddings.create({
  input: chunks,
  model: "text-embedding-ada-002",
})

const embeddingsChunks = chunk(embeddings.data, 10)

for (let i = 0; i < embeddingsChunks.length; i++) {
  const chunk = embeddingsChunks[i]!
  await index.upsert(chunk.map(({ embedding, index }) => ({
    id: index.toString(),
    values: embedding,
  })))
}
