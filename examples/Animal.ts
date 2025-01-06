import { T } from "liminal"
import { schema, SchemaContext } from "../Type/schema.ts"
// import { model } from "liminal/openai"
// import "@std/dotenv/load"
// import OpenAI from "openai"

const Dog = T.object({
  name: T.string,
  ownerName: T.string,
  favoriteToy: T.string,
  something: T.const(T.string, "HI!"),
})

const ctx = new SchemaContext()
console.log(schema(Dog, ctx))
console.log(ctx.phantoms)

// await Dog
//   .value(model(new OpenAI(), "gpt-4o-mini"))
//   .then(console.log)
