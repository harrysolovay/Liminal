import "@std/dotenv/load"
import { T } from "structured-outputs"

const A = T.object({
  a: T.string,
})

const B = T.taggedUnion("type", {
  A,
  B: T.string,
})

const C = T.object({
  a: A,
  b: B,
})

console.log(C)
