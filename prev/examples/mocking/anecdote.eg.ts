export const Anecdote = Thread(async (parent: Thread) => {
  const embedding = await getEmbedding(parent.slice(0, 5))
  const [story] = await similar(embedding, 1, 2 /* `top_k` threshold */)
  return story
})`Check if there is a story sufficiently applicable to the current discussion.`

declare function getEmbedding(value: string): Promise<Array<number>>
declare function similar(...args: any): Promise<Array<string>>
declare function Thread(...args: any): (...args: any) => any
type Thread = any
