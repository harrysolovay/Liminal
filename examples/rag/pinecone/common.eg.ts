import { Pinecone } from "@pinecone-database/pinecone"
import "@std/dotenv/load"
import { fromFileUrl } from "@std/path"
import { chunkText } from "../../../util/mod.ts"

export const pinecone = new Pinecone()
const INDEX = "monsters"

const draculaText = await Deno.readTextFile(
  fromFileUrl(import.meta.resolve("../../stories/dracula.txt")),
)

export const chunks = chunkText(draculaText)

export const index = await ensureMonstersIndex()

async function ensureMonstersIndex() {
  const indices = await pinecone.listIndexes()
  if (!(indices.indexes?.find((v) => v.name === INDEX))) {
    await pinecone.createIndex({
      name: INDEX,
      dimension: 1536,
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    })
  }
  return pinecone.Index(INDEX)
}
