import "@std/dotenv/load"
import { T } from "structured-outputs"

console.log(T.object({
  a: T.string,
}))
