import { Ty } from "./Ty.ts"

export const none: Ty<null, never> = Ty((description) => ({
  type: "null",
  description,
}))

export const boolean: Ty<boolean, never> = Ty((description) => ({
  type: "boolean",
  description,
}))

export const number: Ty<number, never> = Ty((description) => ({
  type: "number",
  description,
}))

export const string: Ty<string, never> = Ty((description) => ({
  type: "string",
  description,
}))
