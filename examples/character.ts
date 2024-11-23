import { T } from "../mod.ts"

export const Sex = T.literalUnion("Male", "Female")`The biological sex of the character.`

export const Main = T.object({
  name: T.string`"Name of the character`,
  background: T.string`Background of the character.`,
})`The details pertinent to the main character.`

export const Anonymous = T.object({
  disposition: T.string`Disposition of the character.`,
  focusReason: T.string`Reason the character has temporarily entered the scene.`,
})`The details of a character who makes a brief appearance.`

export const Details = T.taggedUnion({ Main, Anonymous })`Details which vary by character type.`

export const Age = T.number`The age of the character.`

export const Character = T.object({
  age: Age,
  sex: Sex,
  details: Details,
})`A character in a story.`
