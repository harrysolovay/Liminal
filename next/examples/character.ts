import * as T from "../mod.ts"

const x = T.object({
  name: T.string`The character's ${"something"} name.`,
  age: T.string`The character's age.`,
})`Some description.`
