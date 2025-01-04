import "@std/dotenv/load"
import { chunk } from "@std/collections"
import { index, textChunks } from "./common.ts"
import { embedding } from "./embeddings.ts"

const embeddingChunks = chunk(await Promise.all(textChunks.map(embedding)), 5)

for (let i = 0; i < embeddingChunks.length; i++) {
  const chunk = embeddingChunks[i]!
  console.log("Uploading chunk", chunk)
  await index.upsert(chunk)
}
