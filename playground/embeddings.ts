import { pipeline } from "@huggingface/transformers"

const extractorPending = pipeline("feature-extraction")

// TODO: fix
export async function embedding(text: string, i: number): Promise<Embedding> {
  const extractor = await extractorPending
  const { data } = await extractor(text)
  return {
    id: i.toString(),
    values: [...data],
  }
}

export interface Embedding {
  id: string
  values: Array<number>
}

await embedding("SOMETHING", 1)
