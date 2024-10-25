import * as T from "structured-outputs"

export const Sex = T.union(
  "The biological sex of the character.",
  [
    T.literal(undefined, "Male"),
    T.literal(undefined, "Female"),
  ],
)

export const Gender = T.union(
  "The gender identity of the character.",
  [
    T.object("Male gender identity variant.", {
      type: T.literal(undefined, "Male"),
    }),
    T.object("Female gender identity variant", {
      type: T.literal(undefined, "Female"),
    }),
    T.object("Other gender identity variant", {
      type: T.literal(undefined, "Other"),
      which: T.string("Description of the gender identity"),
    }),
  ],
)

export const Main = T.object(
  "The details pertinent to the main character.",
  {
    type: T.literal(undefined, "Main"),
    name: T.string(
      "Name of the character",
    ),
    background: T.string(
      "Background of the character.",
    ),
  },
)

export const Anonymous = T.object(
  "The details of a character who makes a brief appearance.",
  {
    type: T.literal(undefined, "Anonymous"),
    disposition: T.string(
      "Disposition of the character.",
    ),
    focusReason: T.string(
      "Reason the character has temporarily entered the scene.",
    ),
  },
)

export const Details = T.union(
  "Details which vary by character type.",
  [
    Main,
    Anonymous,
  ],
)

export const Age = T.number(
  "The age of the character.",
)

export class Character extends T.object(
  "A character in a story.",
  {
    age: Age,
    sex: Sex,
    gender: Gender,
    details: Details,
  },
) {}

const schema = T.schema({ Sex, Gender, Main, Anonymous, Details, Age, Character }, "Character")

console.log(schema)
