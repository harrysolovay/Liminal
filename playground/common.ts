import { Pinecone } from "@pinecone-database/pinecone"
import "@std/dotenv/load"
import { fromFileUrl } from "@std/path"
import { chunkText } from "../util/mod.ts"

export const textChunks = await Deno
  .readTextFile(fromFileUrl(import.meta.resolve("../examples/dracula.txt")))
  .then(chunkText)

export const pinecone = new Pinecone()

const INDEX = "monsters"
const indices = await pinecone.listIndexes()
if (!(indices.indexes?.find((v) => v.name === INDEX))) {
  await pinecone.createIndex({
    name: INDEX,
    dimension: 68352,
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  })
}
export const index = pinecone.Index(INDEX)
